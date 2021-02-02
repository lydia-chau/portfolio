#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <assert.h>
#include "../value.h"
Value *lst;

// Creates a new NULL_TYPE value node.
Value *makeNullT(){
  Value *null = malloc(sizeof(Value));
  (*null).type = NULL_TYPE;
  return null;
}

// Creates a new CONS_TYPE value node.
Value *consT(Value *newCar, Value *newCdr){
  assert(newCar != NULL);
  assert(newCdr != NULL);
  Value *cell = malloc(sizeof(Value));
  (*cell).type = CONS_TYPE;
  (*cell).c.car = newCar;
  (*cell).c.cdr = newCdr;
  return cell;
}
// Replacement for malloc that stores the pointers allocated. It should store
// the pointers in some kind of list; a linked list would do fine, but insert
// here whatever code you'll need to do so; don't call functions in the
// pre-existing linkedlist.h. Otherwise you'll end up with circular
// dependencies, since you're going to modify the linked list to use talloc.
void *talloc(size_t size){
  if (lst == NULL){
      lst = makeNullT();
  }
  void *item = malloc(size);
  Value *pointer = malloc(size);
  (*pointer).type = PTR_TYPE;
  (*pointer).p = item;
  lst = consT(pointer, lst);
  return item;
}

// Free all pointers allocated by talloc, as well as whatever memory you
// allocated in lists to hold those pointers.
void tfree() {
  //while list is not nulltype
  //go into the car of the list, free p, free car of the list, 
  //make temp variable= list(cons cell), list now points to cdr, free temp var
  //finish, free the null type
  while ((*lst).type != NULL_TYPE) {
      free ((*(*lst).c.car).p);
      free ((*lst).c.car);
      Value *tempCons = lst;
      lst = (*lst).c.cdr;
      free (tempCons);
  }
  free(lst);
  lst = NULL;
}

// Replacement for the C function "exit", that consists of two lines: it calls
// tfree before calling exit. It's useful to have later on; if an error happens,
// you can exit your program, and all memory is automatically cleaned up.
void texit(int status){
  tfree();
  exit(status);
}
