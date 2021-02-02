#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include "../value.h"
#include "../talloc.h"
#include "../linkedlist.h"

#ifndef _TOKENIZER
#define _TOKENIZER

char token[301]; //we can put 300 elements in token, the 300th index is the NULL, so the size is 301
int tokenIndex = 0;
char possible[17] = {'!' , '$' , '%' , '&' , '*' , '/' , ':' , '<' , '=' , '>' , '?' , '~' , '_' , '^' , '+', '-', '.'};

//This function is called when we want to determine whether a character appears in an array
int inArray(char array[], char c, int size){
  for (int i = 0; i < size; i ++){
    if (array[i] == c){
      return 1;
    }
  }
  return 0;
}

//This function is called only when the first character is a 'special symbol', never called when it is a digit or decimal point
//Determines whether the string is a symbol or not
int isSymbol (char str[], int current){
  while (str[current] != '\0'){
    if (inArray(possible, str[current], 17)){
      current += 1;
    } else if (isalpha(str[current]) || isdigit(str[current])) {
        current += 1;
    } else{
      return 0;
    }
  }
  return 1;
}

//This function is called when we hit a character that is a '.'
int isUDecimal(char str[], int current){
  int count_dec = 1;
  while((count_dec == 1) && (str[current] != '\0')){
    if(str[current] == '.'){
      count_dec += 1;
    }
    current += 1;
  }
  if(count_dec != 1){
    return 0;
  }
  return 1;
}

//This function is only called when the first char of the string is +/- or digit
int isUInt(char str[], int current){
  while (str[current] != '\0'){
    if (isdigit(str[current])){
      current += 1;
    } else if(str[current] == '.'){
      return isUDecimal(str, current+1);
    } else {
        return 0;
    }
  }
  return 2;
}

int isNotTerminalState(char c){
    if(c != ' ' && c != ';' && c != '(' && c != ')' && c != '[' && c != ']' && c != '\n' && c != EOF){
        return 1;
    }
    return 0;
}

void untokenizable(){
    printf("Syntax Error: untokenizable\n");
    texit(1);
}

// Read all of the input from stdin, and return a linked list consisting of the
// tokens.
Value *tokenize() {
    char charRead;
    int checkType;
    Value *list = makeNull();
    charRead = (char)fgetc(stdin);

    while (charRead != EOF) {
        tokenIndex = 0;
        checkType = 100;
         if(charRead == '(') {                              // (
            Value *open = talloc(sizeof(Value));
            (*open).type = OPEN_TYPE;
            (*open).s = "(";
            list = cons(open ,list);
        } else if(charRead == ')') {                              // )
            Value *close = talloc(sizeof(Value));
            (*close).type = CLOSE_TYPE;
            (*close).s = ")";
            list = cons(close ,list);
        } else if(charRead == '[') {                              // [
          Value *open = talloc(sizeof(Value));
          (*open).type = OPENBRACKET_TYPE;
          (*open).s = "[";
          list = cons(open ,list);
        } else if(charRead == ']') {                              // ]
          Value *open = talloc(sizeof(Value));
          (*open).type = CLOSEBRACKET_TYPE;
          (*open).s = "]";
          list = cons(open ,list);
        }  else if(charRead == '\'') {                           // ]
          charRead = (char)fgetc(stdin);
          if(charRead == ' ' || charRead == '\n' || charRead == '\'' || charRead == EOF){
              untokenizable();
          }
          Value *quote = talloc(sizeof(Value));
          (*quote).type = SINGLEQUOTE_TYPE;
          (*quote).s = "'";
          list = cons(quote,list);
          continue;
        } else if(charRead == ' ') {                              // )
            charRead = (char)fgetc(stdin);
            if(charRead == '.'){
                token[0] = charRead;
                tokenIndex = 1;
                charRead = (char)fgetc(stdin);
              if(charRead == ' '){
                Value *dot = talloc(sizeof(Value));
                (*dot).type = DOT_TYPE;
                (*dot).s = ".";
                list = cons(dot,list);
                charRead = (char)fgetc(stdin);
              }else{
                  if(isdigit(charRead)){
                      goto canBeDecimal;
                  }else{
                      goto invalid;
                  }
              }
            }
            continue;
        }else if(charRead == '+' || charRead == '-'){            // + or -
            token[tokenIndex] = charRead;
            tokenIndex += 1;
            charRead = (char)fgetc(stdin);
            while(isNotTerminalState(charRead)){
                if(tokenIndex > 299){
                    printf ("Exceeded Token Size: untokenizable\n");
                    texit(1);
                }
                token[tokenIndex] = charRead;
                tokenIndex += 1;
                charRead = (char)fgetc(stdin);
            }
            token[tokenIndex] = '\0';
            // is symbol
            if(token[1] == '\0'){
              Value *symbol = talloc(sizeof(Value));
              (*symbol).type = SYMBOL_TYPE;
              (*symbol).s = talloc(sizeof(Value));
              strcpy((*symbol).s, token);
              list = cons(symbol ,list);
              checkType = 3;
            }
            // else if udecimal
            else if(token[1] == '.'){
              checkType = isUDecimal(token, 2);
            }
            // else if digit
            else if(isdigit(token[1])){
              checkType = isUInt(token, 2);
            }

            //evaluate checkType value

            // token invalid
            if(checkType == 0){
              untokenizable();
            }
            // token was udecimal
            else if(checkType == 1){
              Value *decimal = talloc(sizeof(Value));
              char *willBeDouble;
              (*decimal).type = DOUBLE_TYPE;
              (*decimal).d = strtod(token, &willBeDouble);
              list = cons(decimal ,list);
            }
            // token was uinteger
            else if(checkType == 2){
              Value *integer = talloc(sizeof(Value));
              (*integer).type = INT_TYPE;
              char *willBeInteger;
              (*integer).i = strtol(token , &willBeInteger, 10);
              list = cons(integer ,list);
            }
            continue;
        } else if(charRead == '#'){                               // if boolean
            charRead = (char)fgetc(stdin);
            if (charRead != 't' && charRead!= 'f'){
                untokenizable();
            }else if( charRead == 't'){
                charRead = (char)fgetc(stdin);
                if(!isNotTerminalState(charRead)){
                    Value *t = talloc(sizeof(Value));
                    (*t).type = BOOL_TYPE;
                    (*t).i = 1;
                    list = cons(t, list);
                }else{
                    untokenizable();
                }
            }else if( charRead == 'f'){
                charRead = (char)fgetc(stdin);
                if(!isNotTerminalState(charRead)){
                    Value *f = talloc(sizeof(Value));
                    (*f).type = BOOL_TYPE;
                    (*f).i = 0;
                    list = cons(f, list);
                } else {
                    untokenizable();
                }
            }
            continue;
        }else if(isdigit(charRead)){                              //if number
            token[tokenIndex] = charRead;
            tokenIndex += 1;
            charRead = (char)fgetc(stdin);
            while(isNotTerminalState(charRead)){
                if(tokenIndex > 299){
                    printf ("Exceeded Token Size: untokenizable\n");
                    texit(1);
                }
                token[tokenIndex] = charRead;
                tokenIndex += 1;
                charRead = (char)fgetc(stdin);
            }
            token[tokenIndex] = '\0';
            checkType = isUInt(token, 1);

            if(checkType == '\0'){
                untokenizable();
            } else if(checkType == 1){
              Value *decimal = talloc(sizeof(Value));
              char *willBeDouble;
              (*decimal).type = DOUBLE_TYPE;
              (*decimal).d = strtod(token, &willBeDouble);
              list = cons(decimal ,list);
            }
            else if(checkType == 2){
              Value *integer = talloc(sizeof(Value));
              char *willBeInteger;
              (*integer).type = INT_TYPE;
              char *ptr;
              ptr = token;
              (*integer).i = (int)strtol(ptr, &willBeInteger, 10);
              list = cons(integer, list);
            }
            continue;

        }else if(charRead == '.'){
            token[tokenIndex] = charRead;
            tokenIndex += 1;
            charRead = (char)fgetc(stdin);
            while(isNotTerminalState(charRead)){
                if(tokenIndex > 299){
                    printf ("Exceeded Token Size: untokenizable\n");
                    texit(1);
                }
                canBeDecimal:
                token[tokenIndex] = charRead;
                tokenIndex+=1;
                charRead = (char)fgetc(stdin);
            }
            token[tokenIndex] = '\0';

            //check if double type
            checkType = isUDecimal(token, 1);
            if(token[1] == '\0'){
              untokenizable();
            }
            else if(checkType == 1){
                Value *decimal = talloc(sizeof(Value));
                char *willBeDouble;
                (*decimal).type = DOUBLE_TYPE;
                (*decimal).d = strtod(token, &willBeDouble);
                list = cons(decimal ,list);
            }else{
                invalid:
                untokenizable();
            }
            continue;
            //check if symbol type
        } else if(isalpha(charRead) || inArray(possible, charRead, 17)){               //if symbol
            token[tokenIndex] = charRead;
            tokenIndex += 1;
            charRead = (char)fgetc(stdin);
            while(isNotTerminalState(charRead)){
              if (tokenIndex > 299){
                  printf ("Exceeded Token Size: untokenizable\n");
                  texit(1);
              }
              token[tokenIndex] = charRead;
              tokenIndex += 1;
              charRead = (char)fgetc(stdin);
          }
          token[tokenIndex] = '\0';
          checkType = isSymbol(token, 1);
          if(checkType == 0){
              untokenizable();
          } else if (checkType == 1) {

            Value *symbol = talloc(sizeof(Value));
            (*symbol).type = SYMBOL_TYPE;
            (*symbol).s = talloc(sizeof(Value));
            strcpy((*symbol).s, token);
            list = cons(symbol,list);
          }
          continue;

          //check if string type
        } else if(charRead == '"'){                               // "
          charRead = (char)fgetc(stdin);
          tokenIndex = 0;
          while(charRead != '"'){
              if(tokenIndex > 299){
                  printf("Exceeded Token Size: untokenizable\n");
                  texit(1);
              }
              token[tokenIndex] = charRead;
              tokenIndex+=1;
              charRead = (char)fgetc(stdin);
          }

          token[tokenIndex] = '\0';
          Value *string = talloc(sizeof(Value));
          (*string).type = STR_TYPE;
          (*string).s = talloc(sizeof(Value));
          strcpy((*string).s, token);
          list = cons(string ,list);
        } else if(charRead == ';'){                             // ;;
          charRead = (char)fgetc(stdin);
          while(charRead != '\n' && charRead != EOF){
              charRead = (char)fgetc(stdin);
          }
        }
        charRead = (char)fgetc(stdin);

      } // EOF reached
    Value *revList = reverse(list);
    return revList;
}

// Displays the contents of the linked list as tokens, with type information
void displayTokens(Value *list){
  Value *cur = list;
  while((*cur).type != NULL_TYPE){
    switch ((*(*cur).c.car).type){
      case INT_TYPE:
        printf("%i:integer\n", (*(*cur).c.car).i);
        break;
      case DOUBLE_TYPE:
        printf("%f:double\n", (*(*cur).c.car).d);
        break;
      case STR_TYPE:
        printf("\"%s\":string\n", (*(*cur).c.car).s);
        break;
      case BOOL_TYPE:
        printf("%i:boolean\n", (*(*cur).c.car).i);
        break;
      case SYMBOL_TYPE:
        printf("%s:symbol\n", (*(*cur).c.car).s);
        break;
      case OPEN_TYPE:
        printf("%s:open\n", (*(*cur).c.car).s);
        break;
      case CLOSE_TYPE:
        printf("%s:close\n", (*(*cur).c.car).s);
        break;
      case OPENBRACKET_TYPE:
        printf("%s:openbracket\n", (*(*cur).c.car).s);
        break;
      case CLOSEBRACKET_TYPE:
        printf("%s:closebracket\n", (*(*cur).c.car).s);
        break;
      case SINGLEQUOTE_TYPE:
        printf("%s:singlequote\n", (*(*cur).c.car).s);
        break;
      case DOT_TYPE:
        printf("%s:dot\n", (*(*cur).c.car).s);
        break;
      case CONS_TYPE:
        break;
      case NULL_TYPE:
        break;
      case PTR_TYPE:
        break;
      case VOID_TYPE:
        break;
      default:
          break;
    }
    cur = (*cur).c.cdr;
  }
}


#endif
