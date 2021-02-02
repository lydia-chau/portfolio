#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <assert.h>
#include "../value.h"
#include "../talloc.h"

// Creates a new NULL_TYPE value node.
Value *makeNull(){
  Value *null = talloc(sizeof(Value));
  (*null).type = NULL_TYPE;
  return null;
}

// Creates a new CONS_TYPE value node.
Value *cons(Value *newCar, Value *newCdr){
  assert(newCar != NULL);
  assert(newCdr != NULL);
  Value *cell = talloc(sizeof(Value));
  (*cell).type = CONS_TYPE;
  (*cell).c.car = newCar;
  (*cell).c.cdr = newCdr;
  return cell;
}

// Displays the contents of the linked list to the screen
void display(Value *list){
  assert(list != NULL);
  assert((*list).type == CONS_TYPE);
  Value *cur = list;
  int count = 0;
  while((*cur).type != NULL_TYPE){
      switch ((*(*cur).c.car).type){
        case INT_TYPE:
          printf("Element %i is %i\n", count, (*(*cur).c.car).i);
          break;
        case DOUBLE_TYPE:
          printf("Element %i is %f\n", count, (*(*cur).c.car).d);
          break;
        case STR_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
          break;
        case CONS_TYPE:
          break;
        case NULL_TYPE:
          printf("Element %i is of NULL_TYPE\n", count);
          break;
        case PTR_TYPE:
          printf("Element %i is of PTR_TYPE\n", count);
          break;
        case BOOL_TYPE:
          printf("Element %i is %i\n", count, (*(*cur).c.car).i);
          break;
        case SYMBOL_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
          break;
        case OPEN_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
          break;
        case CLOSE_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
          break;
        case OPENBRACKET_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
          break;
        case CLOSEBRACKET_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
          break;
        case SINGLEQUOTE_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
        case DOT_TYPE:
          printf("Element %i is %s\n", count, (*(*cur).c.car).s);
        case VOID_TYPE:
          printf("Element %i is VOID_TYPE\n", count);
        case CLOSURE_TYPE:
          printf("Element %i is CLOSURE_TYPE\n", count);
        case PRIMITIVE_TYPE:
          printf("Element %i is PRIMITIVE_TYPE\n", count);
      }
      cur = (*cur).c.cdr;
      count++;
  }
}

// Returns a new list that is the reverse of the one that is passed in.

Value *reverse(Value *list){
    assert(list != NULL);
    Value *rev = makeNull();
    Value *cur = list;

    while((*cur).type != NULL_TYPE){
        rev = cons((*cur).c.car,rev);
        cur = (*cur).c.cdr;
    }
    return rev;
}


// Utility to make it less typing to get car value.
Value *car(Value *list){
    assert(list != NULL);
    assert((*list).type == CONS_TYPE);
    Value *isCar = (*list).c.car;
    return isCar;
}

// Utility to make it less typing to get cdr value.
Value *cdr(Value *list){
  assert(list != NULL);
  assert((*list).type == CONS_TYPE);
  Value *isCdr = (*list).c.cdr;
  return isCdr;
}
// Utility to check if pointing to a NULL_TYPE value.
bool isNull(Value *value){
  assert(value != NULL);
  if((*value).type == NULL_TYPE){
    return true;
    }
  return false;
}

// Measure length of list.
int length(Value *value){
  assert((*value).type == CONS_TYPE);
  int i = 0;
  Value *cur = value;
  while((*cur).type != NULL_TYPE){
    cur = (*cur).c.cdr;
    i++;
  }
  return i;
}
