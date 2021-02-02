#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include "../value.h"
#include "../talloc.h"
#include "../linkedlist.h"
#include "../tokenizer.h"

void syntaxError(){
    printf("Syntax error: not enough close parentheses\n");
    texit(1);
}

Value *addToParseTree(Value *tree, int *depth, Value *token){
    if(token->type == OPEN_TYPE){
        tree = cons(token, tree);
        *depth += 1;
    }else if(token->type == CLOSE_TYPE){
        Value *subtree = makeNull();
        while(tree->type != NULL_TYPE){
            if(car(tree)->type != OPEN_TYPE){
                subtree = cons(car(tree), subtree);
                tree = cdr(tree);
            }else{
                break;
            }
        }
        if(tree->type == NULL_TYPE){
            printf("Syntax error: too many close parentheses\n");
            texit(1);
        }
        tree = cdr(tree);
        tree = cons(subtree, tree);

        *depth -= 1;
    }else if(token->type != NULL_TYPE){
        tree = cons(token, tree);
    }
    return tree;
}
// Takes a list of tokens from a Racket program, and returns a pointer to a
// parse tree representing that program.
Value *parse(Value *tokens){

    Value *tree = makeNull();
    int depth = 0;

    Value *current = tokens;
    assert(current != NULL && "Error (parse): null pointer");
    while (current->type != NULL_TYPE) {
        Value *token = car(current);
        tree = addToParseTree(tree, &depth, token);
        current = cdr(current);
    }
    if (depth != 0) {
       syntaxError();
    }
    return reverse(tree);
}
// Prints the tree to the screen in a readable fashion. It should look just like
// Racket code; use parentheses to indicate subtrees.
void printTree(Value *tree){
    Value *cur = tree;
    while(cur->type != NULL_TYPE){
        switch (car(cur)->type){
            case INT_TYPE:
                if(cdr(cur)->type == NULL_TYPE){
                    printf("%i", car(cur)->i);
                }else{
                    printf("%i ", car(cur)->i);
                }
                break;
            case DOUBLE_TYPE:
                if(cdr(cur)->type == NULL_TYPE){
                    printf("%f", car(cur)->d);
                }else{
                    printf("%f ", car(cur)->d);
                }
                break;
            case STR_TYPE:
                if(cdr(cur)->type == NULL_TYPE){
                    printf("\"%s\"", car(cur)->s);
                }else{
                    printf("\"%s\" ", car(cur)->s);
                }
                break;
            case BOOL_TYPE:
                if(cdr(cur)->type == NULL_TYPE){
                    printf("%i", car(cur)->i);
                }else{
                    printf("%i ", car(cur)->i);
                }
                break;
            case SYMBOL_TYPE:
                if(cdr(cur)->type == NULL_TYPE){
                    printf("%s", car(cur)->s);
                }else{
                    printf("%s ", car(cur)->s);
                }
                break;
            case OPEN_TYPE:
                break;
            case CLOSE_TYPE:
                break;
            case OPENBRACKET_TYPE:
                printf("%s", car(cur)->s);
                break;
            case CLOSEBRACKET_TYPE:
                printf("%s ", car(cur)->s);
                break;
            case SINGLEQUOTE_TYPE:
                printf("%s", car(cur)->s);
                break;
            case DOT_TYPE:
                printf(". ");
                break;
            case CONS_TYPE:
                printf("(");
                printTree(car(cur));
                if(cdr(cur)->type != NULL_TYPE){
                    printf(") ");
                }else{
                    printf(")");
                }
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
        cur = cdr(cur);
    }
}
