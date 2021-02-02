#include <stdio.h>
#include <assert.h>
#include <string.h>
#include "value.h"
#include "talloc.h"
#include "linkedlist.h"
#include "tokenizer.h"
#include "parser.h"
#include "interpreter.h"

void invType(char *s){
    printf("Expected %s\n", s);
    texit(1);
}
void paramError(int given, int req){
    printf("Number Params Given: %i\nNumber Params Expected: %i\n", given, req);
    texit(1);
}

void symbolError(){
    printf("Symbol not found\n");
    texit(1);
}
void evaluationError(){
    printf("evaluation error\n");
    texit(1);
}

//goes to the frame passed in and finds the associated value the variable is binded to
Value *lookUpSymbol(Value *tree, Frame *frame){
      Value *cur_binding = frame->bindings;
      Frame *cur_frame = frame;
      Value *result = NULL;
      while(cur_frame->parent != NULL){
          cur_binding = cur_frame->bindings;
          while(!isNull(cur_binding)){
              Value *pair = car(cur_binding);
              assert(car(pair)->type == SYMBOL_TYPE);
              if(!strcmp(car(pair)->s, tree->s)){
                  result = car(cdr(pair));
                  break;
              }
              cur_binding = cdr(cur_binding);
          }
          cur_frame = cur_frame->parent;
      }
      if(result == NULL){                     //check global frame
          cur_binding = cur_frame->bindings;
          while(!isNull(cur_binding)){
              Value *pair = car(cur_binding);
              assert(car(pair)->type == SYMBOL_TYPE);
              if(!strcmp(car(pair)->s, tree->s)){
                  result = car(cdr(pair));
                  break;
              }
              cur_binding = cdr(cur_binding);
          }
      }

      if(result == NULL){
          symbolError();
      }
      return result;
}

//evaluates if statements
//evaluates arguments based on their boolean value
Value *evalIf(Value *args, Frame *frame){
    if(length(args) != 3){
        printf("Doesn't have 3 args\n");
        texit(1);
    }
    Value *boolean = eval(car(args), frame);
    if(boolean->type != BOOL_TYPE){
        printf("The first is not BOOL_TYPE\n");
        texit(1);
    }
    Value *result = NULL;
    if(boolean->i == 1){
        result = eval(car(cdr(args)), frame);
    }else if(boolean->i == 0){
        result = eval(car(cdr(cdr(args))), frame);
    }
    return result;
}

//evaluates let statements
//creates a new frame and makes bindings of the arguments
Value *evalLet(Value *args, Frame *frame){
    if(args->type == NULL_TYPE){
        invType("args, given 0");
    }
    else if(length(args) < 2){
        printf("Let has less than 2 args\n");
        texit(1);
    }
    Frame child;
    Frame *c = &child;
    child.parent = frame;
    child.bindings = makeNull();
    if(car(args)->type != CONS_TYPE && car(args)->type != NULL_TYPE){
        invType("list of bindings");
    }
    Value *listOfBindings = car(args);
    while(!isNull(listOfBindings)){
        if(car(listOfBindings)->type != CONS_TYPE){
            invType("list of parameters and their values given only one of these");
        }else if(length(car(listOfBindings)) != 2){
            printf("let error:\n");
            paramError(length(car(listOfBindings)), 2);
        }
        Value *pairs = car(listOfBindings);
        if(car(pairs)->type != SYMBOL_TYPE){
            invType("SYMBOL_TYPE to be assigned to given value");
        }
        Value *var = car(pairs);
        Value *val = eval((car(cdr(pairs))), frame);
        Value *new_pair = makeNull();
        new_pair = cons(val, new_pair);
        new_pair = cons(var, new_pair);
        listOfBindings = cdr(listOfBindings);
        child.bindings = cons(new_pair, child.bindings);
    }
    Value *result = NULL;
    Value *body = cdr(args);
    while(body->type != NULL_TYPE){
     result = eval(car(body), c);
     body = cdr(body);
    }
    return result;
}

//evaluates define statements
//creates a binding to the frame passed in
Value *evalDefine(Value *args, Frame *frame){
    if (args->type == NULL_TYPE){
      paramError(0, 2);
    }
    else if(length(args) != 2){
        paramError(length(args), 2);
    }
    if (car(args)->type != SYMBOL_TYPE){
      invType("SYMBOL_TYPE to be defined");
    }
    Value *binding = makeNull();
    binding = cons(eval(car(cdr(args)), frame), binding);  //cons the expr
    binding = cons(car(args), binding);       //cons the var
    frame->bindings = cons(binding, frame->bindings);  //add to frame
    Value *result = talloc(sizeof(Value));
    result->type = VOID_TYPE;
    return result;
}

//evaluates lambda statements
//creates a closure that contains the parameters and the body
Value *evalLambda(Value *args, Frame *frame){
    Value *closure = talloc(sizeof(Value));
    closure->type = CLOSURE_TYPE;
    if (args->type == NULL_TYPE) {
        closure->cl.paramNames = args;
        closure->cl.functionCode = args;
    } else {
        closure->cl.paramNames = car(args);
        closure->cl.functionCode = cdr(args);
    }
    closure->cl.frame = frame;
    return closure;
}

//evaluates let* statements
//creates frames from left to right
Value *evalLetStar(Value *args, Frame *frame){
  if(args->type == NULL_TYPE){
         invType("args, given 0");
     }
     else if(length(args) < 2){
         printf("Let has less than 2 args\n");
         texit(1);
     }
     if(car(args)->type != CONS_TYPE && car(args)->type != NULL_TYPE){
         invType("list of bindings");
     }
     Value *listOfBindings = car(args);
     Frame *child = talloc(sizeof(Frame));
     child->parent = frame;
     child->bindings = makeNull();
     Frame *prev = child;
     while(!isNull(listOfBindings)){

         if(car(listOfBindings)->type != CONS_TYPE){
             invType("list of parameters and their values given only one of these");
         }else if(length(car(listOfBindings)) != 2){
             printf("let error:\n");
             paramError(length(car(listOfBindings)), 2);
         }
         Value *pairs = car(listOfBindings);
         if(car(pairs)->type != SYMBOL_TYPE){
             invType("SYMBOL_TYPE to be assigned to given value");
         }
         Frame *letStar = talloc(sizeof(Frame));
         letStar->parent = prev;
         letStar->bindings = makeNull();
         Value *var = car(pairs);
         Value *val = eval((car(cdr(pairs))), prev);
         Value *new_pair = makeNull();
         new_pair = cons(val, new_pair);
         new_pair = cons(var, new_pair);
         letStar->bindings = cons(new_pair, letStar->bindings);
         child->bindings = cons(new_pair, child->bindings);
         listOfBindings = cdr(listOfBindings);
         prev = letStar;
     }
     Value *result = NULL;
     Value *body = cdr(args);
     while(body->type != NULL_TYPE){
      result = eval(car(body), child);
      body = cdr(body);
     }
     return result;
}

//evaluates letrec statements
//pair variables to unknown values, then evaluates the values and bind them together
Value *evalLetRec(Value *args, Frame *frame){
  if(args->type == NULL_TYPE){
      invType("args, given 0");
  }
  else if(length(args) < 2){
      printf("Let has less than 2 args\n");
      texit(1);
  }
  if(car(args)->type != CONS_TYPE && car(args)->type != NULL_TYPE){
    invType("list of bindings");
  }

  Value *listOfBindings = car(args);
  Frame *child = talloc(sizeof(Frame));
  child->parent = frame;
  child->bindings = makeNull();


  while(!isNull(listOfBindings)){
      if(car(listOfBindings)->type != CONS_TYPE){
          invType("list of parameters and their values given only one of these");
      }else if(length(car(listOfBindings)) != 2){
          printf("let error:\n");
          paramError(length(car(listOfBindings)), 2);
      }
      Value *pairs = car(listOfBindings);
      if(car(pairs)->type != SYMBOL_TYPE){
          invType("SYMBOL_TYPE to be assigned to given value");
      }
      Value *var = car(pairs);
      Value *val = talloc(sizeof(Value));
      val->type=BOOL_TYPE;
      val->i = 0;
      Value *new_pair = makeNull();
      new_pair = cons(val, new_pair);
      new_pair = cons(var, new_pair);
      child->bindings = cons(new_pair,child->bindings);
      listOfBindings = cdr(listOfBindings);
  }


  Value *evaledValList = makeNull();
  listOfBindings = car(args);

  while(!isNull(listOfBindings)){
      Value *valpairs = car(listOfBindings);

      Value *evaledVal = eval(car(cdr(valpairs)), child);
      evaledValList = cons(evaledVal, evaledValList);
      listOfBindings = cdr(listOfBindings);
  }

  Value *newBinding = makeNull();

  while(!isNull(child->bindings)){
      Value *realPair = makeNull();
      realPair = cons(car(evaledValList), realPair);
      realPair = cons(car(car(child->bindings)),realPair);
      if (car(evaledValList)->type == CLOSURE_TYPE){

      }
      newBinding = cons(realPair,newBinding);
      child->bindings = cdr(child->bindings);
      if(isNull(cdr(evaledValList))){
        break;
      }
      evaledValList = cdr(evaledValList);
  }

  child->bindings = newBinding;

  Value *result = NULL;
  Value *body = cdr(args);

  while(body->type != NULL_TYPE){
   result = eval(car(body), child);
   body = cdr(body);
  }
  return result;
}

//evaluates cond statements
//if first argument is true then evalutaes the variable next to it
//else goes to the second argument and so on
Value *evalCond(Value *args, Frame *frame){
    Value *result = talloc(sizeof(Value));
    result->type = VOID_TYPE;
    if (args->type == NULL_TYPE){
      return result;
    }else if(args->type != CONS_TYPE){
        invType("(cond (test1 arg_1) (test2 arg_2) ...) format");
    }

    Value *cur_cond = args;

    while(!isNull(cur_cond)){
        if(cur_cond->type != CONS_TYPE){
            invType("(cond (test1 arg_1) (test2 arg_2) ...) format");
        }else if(car(car(cur_cond))->type == SYMBOL_TYPE){
            if(!strcmp(car(car(cur_cond))->s, "else")){
                result = eval(car(cdr(car(cur_cond))), frame);
                return result;
            }
        }else if(car(cur_cond)->type == CONS_TYPE){
              if(eval(car(car(cur_cond)), frame)->i == 1){
                  if (cdr(car(cur_cond))->type == NULL_TYPE){
                    return eval(car(car(cur_cond)), frame);
                  }
                  result = eval(car(cdr(car(cur_cond))), frame);
                  return result;
              }
        }
        cur_cond = cdr(args);
        args = cdr(args);

    }
    return result;
}

//evaluates and statements
Value *evalAnd(Value *args, Frame *frame){
    Value *result = talloc(sizeof(Value));
    result->type = BOOL_TYPE;
    result->i = 0;
    Value *cur = args;
    while(!isNull(cur)){
        result = eval(car(cur), frame);
        if (result->i == 0) {
            return result;
        }
        cur = cdr(cur);
    }
    return result;
}

//evalutates or statements
Value *evalOr(Value *args, Frame *frame){
    Value *result = talloc(sizeof(Value));
    result->type = BOOL_TYPE;
    result->i = 0;
    Value *cur = args;
    while(!isNull(cur)){
        result = eval(car(cur), frame);
        if (result->i == 1) {
            return result;
        }
        cur = cdr(cur);
    }
    return result;
}

//evaluates set statements
//reassign values to defined variables
Value *evalSet(Value *args, Frame *frame){
    if(args->type != CONS_TYPE){
        paramError(0, 2);
    }else if(length(args) != 2){
        paramError(length(args), 2);
    }else if(car(args)->type != SYMBOL_TYPE){
        invType("symbol to be redefined");
    }
    Value *result = talloc(sizeof(Value));
    result = lookUpSymbol(car(args), frame);
    *result = *car(cdr(args));
    Value *v = talloc(sizeof(Value));
    v->type = VOID_TYPE;
    return v;
}

//evaluates begin statements
//evaluates and returns the last argument
Value *evalBegin(Value *args, Frame *frame){
    if (args->type == NULL_TYPE){
      Value *result = talloc(sizeof(Value));
      result->type = VOID_TYPE;
      return result;
    }
    Value *result = NULL;
    Value *cur_arg = args;

    while(cur_arg->type != NULL_TYPE){
     result = eval(car(cur_arg), frame);
     cur_arg = cdr(cur_arg);
    }
    return result;
}

//evaluates all of the arguments
Value *evalEach(Value *args, Frame *frame){
    Value *cur_arg = args;
    Value *evaled_args = makeNull();
    while(!isNull(cur_arg)){
        evaled_args = cons(eval(car(cur_arg), frame), evaled_args);
        cur_arg = cdr(cur_arg);
    }
    return reverse(evaled_args);
}

//+ handles any number of integer or real arguments (if 0 arguments, return 0).
//if any of the arguments are reals, return a real; else return an integer.
Value *primitiveAdd(Value *args) {
    Value *result = talloc(sizeof(Value));
    result->type = DOUBLE_TYPE;
    result->d = 0.000000;
    if(isNull(args)){
        return result;
    }
    Value *cur = args;
    while(!isNull(cur)){
      if (car(cur)->type != DOUBLE_TYPE && car(cur)->type != INT_TYPE){
        invType("real numbers as input");
      }

      if (car(cur)->type == DOUBLE_TYPE){
        result->d += car(cur)->d;
      } else if(car(cur)->type == INT_TYPE){
        result->d += car(cur)->i;
      }
      cur = cdr(cur);
    }
   return result;
}

Value *primitiveSubtract(Value *args){
    if(isNull(args)){
        paramError(0, 1);
    }
    Value *result = talloc(sizeof(Value));
    result->type = DOUBLE_TYPE;
    if (car(args)->type == DOUBLE_TYPE){
      result->d = car(args)->d;
    } else if(car(args)->type == INT_TYPE){
      result->d = car(args)->i;
    }
    Value *cur = cdr(args);
    while(!isNull(cur)){
      if (car(cur)->type != DOUBLE_TYPE && car(cur)->type != INT_TYPE){
          printf("The type passed: %i\n", car(cur)->type);
          invType("real numbers as input");
      }

      if (car(cur)->type == DOUBLE_TYPE){
        result->d -= car(cur)->d;
      } else if(car(cur)->type == INT_TYPE){
        result->d -= car(cur)->i;
      }
      cur = cdr(cur);
    }
    return result;
}

Value *primitiveMultiply(Value *args){
    if(isNull(args)){
        paramError(0, 2);
    }else if(length(args) < 2){
        printf("Expected at least 2 args, given 1");
        texit(1);
    }
    Value *result = talloc(sizeof(Value));
    result->type = DOUBLE_TYPE;
    result->d = 1.000000;
    Value *cur = args;
    while(!isNull(cur)){
      if (car(cur)->type != DOUBLE_TYPE && car(cur)->type != INT_TYPE){
        invType("real numbers as input");
      }

      if (car(cur)->type == DOUBLE_TYPE){
        result->d *= car(cur)->d;
      } else if(car(cur)->type == INT_TYPE){
        result->d *= car(cur)->i;
      }
      cur = cdr(cur);
    }
    return result;
}

Value *primitiveDivide(Value *args){
    if(isNull(args)){
        paramError(0, 2);
    }else if(length(args) != 2){
        paramError(length(args), 2);
    }
    Value *result = talloc(sizeof(Value));
    result->type = DOUBLE_TYPE;
    result->d = 0.0;
    if (car(args)->type == DOUBLE_TYPE) {
        if (car(cdr(args))->type == DOUBLE_TYPE) {
            if (car(cdr(args))->d == 0.0) {
              printf("Can't divide by zero\n");
              texit(1);
            }
            result->d = car(args)->d / car(cdr(args))->d;
        }else if(car(cdr(args))->type == INT_TYPE){
            if (car(cdr(args))->i == 0) {
              printf("Can't divide by zero\n");
              texit(1);
            }
            result->d = car(args)->d / (double)car(cdr(args))->i;
        }else{
            invType("real number");
        }
    }else if(car(args)->type == INT_TYPE){
        if (car(cdr(args))->type == DOUBLE_TYPE) {
            if (car(cdr(args))->d == 0.0) {
              printf("Can't divide by zero\n");
              texit(1);
            }
            result->d = (double)car(args)->i / car(cdr(args))->d;
        }else if(car(cdr(args))->type == INT_TYPE){
            if (car(cdr(args))->i == 0) {
              printf("Can't divide by zero\n");
              texit(1);
            }
            result->d = (double)car(args)->i / (double)car(cdr(args))->i;
        }else{
            invType("real number");
        }
    }else{
        invType("real number");
    }
    return result;
}

Value *primitiveModulo(Value *args){
    if(isNull(args)){
        paramError(0, 2);
    }else if(length(args) != 2){
        paramError(length(args), 2);
    }
    if (car(cdr(args))->i == 0) {
      printf("Can't divide by zero\n");
      texit(1);
    }
    Value *result = talloc(sizeof(Value));
    result->type = INT_TYPE;
    result->i = ((car(args)->i % car(cdr(args))->i) + car(cdr(args))->i) % car(cdr(args))->i;
    return result;
}

Value *primitiveLessThan(Value *args){
    if(isNull(args)){
        paramError(0, 2);
    }else if(length(args) != 2){
        paramError(length(args), 2);
    }
    if(car(args)->type != INT_TYPE && car(args)->type != DOUBLE_TYPE){
        invType("real number as first parameter");
    }else if(car(cdr(args))->type != INT_TYPE && car(cdr(args))->type != DOUBLE_TYPE){
        invType("real number as second parameter");
    }
    Value *result = talloc(sizeof(Value));
    result->type = BOOL_TYPE;
    result->i = 0;
    if(car(args)->type == DOUBLE_TYPE) {
        if (car(cdr(args))->type == DOUBLE_TYPE) {
            if (car(args)->d < car(cdr(args))->d) {
              result->i = 1;
            }
        }else if(car(cdr(args))->type == INT_TYPE){
            if (car(args)->d < car(cdr(args))->i) {
              result->i = 1;
            }
          }
    }else if(car(args)->type == INT_TYPE){
        if (car(cdr(args))->type == DOUBLE_TYPE) {
            if (car(args)->i < car(cdr(args))->d) {
              result->i = 1;
            }
        }else if(car(cdr(args))->type == INT_TYPE){
            if (car(args)->i < car(cdr(args))->i) {
              result->i = 1;
            }
          }
        }
    return result;
}

Value *primitiveGreaterThan(Value *args){
    if(isNull(args)){
        paramError(0, 2);
    }else if(length(args) != 2){
        paramError(length(args), 2);
    }
    if(car(args)->type != INT_TYPE && car(args)->type != DOUBLE_TYPE){
        invType("real number as first parameter");
    }else if(car(cdr(args))->type != INT_TYPE && car(cdr(args))->type != DOUBLE_TYPE){
        invType("real number as second parameter");
    }
    Value *result = talloc(sizeof(Value));
    result->type = BOOL_TYPE;
    result->i = 0;
    if(car(args)->type == DOUBLE_TYPE) {
        if (car(cdr(args))->type == DOUBLE_TYPE) {
            if (car(args)->d > car(cdr(args))->d) {
              result->i = 1;
            }
        }else if(car(cdr(args))->type == INT_TYPE){
            if (car(args)->d > car(cdr(args))->i) {
              result->i = 1;
            }
          }
    }else if(car(args)->type == INT_TYPE){
        if (car(cdr(args))->type == DOUBLE_TYPE) {
            if (car(args)->i > car(cdr(args))->d) {
              result->i = 1;
            }
        }else if(car(cdr(args))->type == INT_TYPE){
            if (car(args)->i > car(cdr(args))->i) {
              result->i = 1;
            }
          }
        }
    return result;
}

Value *primitiveEqual(Value *args){
  if(isNull(args)){
      paramError(0, 2);
  }else if(length(args) != 2){
      paramError(length(args), 2);
  }
  if(car(args)->type != INT_TYPE && car(args)->type != DOUBLE_TYPE){
      invType("real number as first parameter");
  }else if(car(cdr(args))->type != INT_TYPE && car(cdr(args))->type != DOUBLE_TYPE){
      invType("real number as second parameter");
  }
  Value *result = talloc(sizeof(Value));
  result->type = BOOL_TYPE;
  result->i = 0;
  if(car(args)->type == DOUBLE_TYPE) {
      if (car(cdr(args))->type == DOUBLE_TYPE) {
          if (car(args)->d == car(cdr(args))->d) {
            result->i = 1;
          }
      }else if(car(cdr(args))->type == INT_TYPE){
          if (car(args)->d == car(cdr(args))->i) {
            result->i = 1;
          }
        }
  }else if(car(args)->type == INT_TYPE){
      if (car(cdr(args))->type == DOUBLE_TYPE) {
          if (car(args)->i == car(cdr(args))->d) {
            result->i = 1;
          }
      }else if(car(cdr(args))->type == INT_TYPE){
          if (car(args)->i == car(cdr(args))->i) {
            result->i = 1;
          }
        }
      }
    return result;
}

Value *primitiveNull(Value *args) {
    if (args->type != CONS_TYPE){
        invType("1 arg for null? function");
    }else if(length(args)!= 1){
      paramError(length(args), 1);
    }
    Value *result = talloc(sizeof(Value));
    result->type = BOOL_TYPE;
    if(isNull(car(args))){
        result->i = 1;
        return result;
    }else if(car(args)->type != CONS_TYPE){
        result->i = 0;
        return result;
    }
    if(car(car(args))->type != NULL_TYPE){
        result->i = 0;
    }else{
        result->i = 1;
    }
  return result;
}

Value *primitiveCar(Value *args) {
  if (args->type != CONS_TYPE){
      invType("1 arg for car function");
  }else if (length(args)!= 1){
    paramError(length(args), 1);
  }
  if(car(args)->type != CONS_TYPE){
      invType("CONS_TYPE");
  }
  return car(car(args));
}

Value *primitiveCdr(Value *args) {
  if (args->type != CONS_TYPE){
      invType("1 arg for cdr function");
  }else if (length(args)!= 1){
    paramError(length(args), 1);
  }
  if(car(args)->type != CONS_TYPE){
      invType("CONS_TYPE");
  }
  return cdr(car(args));
}


Value *primitiveCons(Value *args){
    if (args->type != CONS_TYPE){
        invType("2 args for cons function");
    }else if (length(args)!= 2){
      paramError(length(args), 2);
    }
    return cons(car(args), car(cdr(args)));
}

/*
/Constructs a new frame whose parent frame is the environment stored in the closure.
/Adds bindings to the new frame mapping each formal parameter to actual param.
/Evaluates the body with the new frame as its environment
/return the result of the call to eval
*/
Value *apply(Value *evaledOperator, Value *evaledArgs){
    Value *result = NULL;
    if(evaledOperator->type == CLOSURE_TYPE){
      Frame *new_frame = talloc(sizeof(Frame));
      new_frame->parent = evaledOperator->cl.frame;
      new_frame->bindings = makeNull();
      Value *cur_param = evaledOperator->cl.paramNames;
      Value *cur_evaledArg = evaledArgs;
      if (evaledArgs->type != NULL_TYPE) {
          if(evaledOperator->cl.paramNames->type == NULL_TYPE){
              paramError(length(evaledArgs), 0);
          }else if(length(evaledArgs) != length(evaledOperator->cl.paramNames)){
              paramError(length(evaledArgs), length(evaledOperator->cl.paramNames));
          }
      }
      while(!isNull(cur_param)){
          Value *new_pair = makeNull();
          new_pair = cons(car(cur_evaledArg),new_pair);
          new_pair = cons(car(cur_param), new_pair);
          new_frame->bindings = cons(new_pair, new_frame->bindings);
          cur_param = cdr(cur_param);
          cur_evaledArg = cdr(cur_evaledArg);
      }
      Value *expr = evaledOperator->cl.functionCode;
      while(expr->type != NULL_TYPE){
       result = eval(car(expr), new_frame);
       expr = cdr(expr);
      }
    }else if(evaledOperator->type == PRIMITIVE_TYPE){
        result = (*(evaledOperator->pf))(evaledArgs);
    }

    return result;
}

//binds a primitive function with its name
void bind(char *name, Value *(*function)(struct Value *), Frame *frame) {
    // Add primitive functions to top-level bindings list
    Value *value = talloc(sizeof(Value));
    value->type = PRIMITIVE_TYPE;
    value->pf = function;
    Value *new_pair = makeNull();
    new_pair = cons(value, new_pair);
    Value *primitiveName = talloc(sizeof(Value));
    primitiveName->type = SYMBOL_TYPE;
    primitiveName->s = name;
    new_pair = cons(primitiveName, new_pair);
    frame->bindings = cons(new_pair, frame->bindings);
  }


Value *eval(Value *expr, Frame *frame){
   switch (expr->type)  {
     case INT_TYPE: {
        return expr;
        break;
     }
     case DOUBLE_TYPE: {
        return expr;
        break;
     }
     case BOOL_TYPE: {
        return expr;
        break;
     }
     case STR_TYPE: {
        return expr;
        break;
     }
     case SYMBOL_TYPE: {
        return lookUpSymbol(expr, frame);
        break;
     }
     case CONS_TYPE: {
        Value *first = car(expr);
        Value *args = cdr(expr);
        Value *result = NULL;
        // Sanity and error checking on first...
        assert(first->type == SYMBOL_TYPE);
        assert(args->type == CONS_TYPE || args->type == NULL_TYPE);
        if (!strcmp(first->s,"if")) {
            result = evalIf(args, frame);
            return result;
        } else if (!strcmp(first->s, "let")){
            result = evalLet(args, frame);
            return result;
        } else if(!strcmp(first->s, "quote")){
            if(length(args) != 1){
                evaluationError();
            }
            return car(args);
        }else if(!strcmp(first->s, "define")){
            result = evalDefine(args, frame);
            return result;
        }else if(!strcmp(first->s, "lambda")){
            result = evalLambda(args, frame);
            return result;
        }else if(!strcmp(first->s, "let*")){
            result = evalLetStar(args, frame);
            return result;
        }else if(!strcmp(first->s, "letrec")){
            result = evalLetRec(args, frame);
            return result;
        }else if (!strcmp(first->s, "cond")){
            result = evalCond(args, frame);
            return result;
        }else if (!strcmp(first->s, "and")){
            result = evalAnd(args, frame);
            return result;
        }else if (!strcmp(first->s, "or")){
            result = evalOr(args, frame);
            return result;
        }else if(!strcmp(first->s, "set!")){
            result = evalSet(args, frame);
            return result;
        }else if(!strcmp(first->s, "begin")){
            result = evalBegin(args, frame);
            return result;
        }else {
          // If not a special form, evaluate the first, evaluate the args, then
          // apply the first to the args.
           //evaledOperator is the closure of the function
           Value *evaledOperator = eval(first, frame);
           Value *evaledArgs = evalEach(args, frame);
           return apply(evaledOperator, evaledArgs);
        }
        break;
     }

     default :
        break;
    }
   return NULL;
}

void printInterpret(Value *tree){
    Value *cur = tree;
    switch(tree->type){
          case INT_TYPE:
              printf("%i", tree->i);
              break;
          case DOUBLE_TYPE:
              printf("%f", tree->d);
              break;
          case STR_TYPE:
              printf("\"%s\"", tree->s);
              break;
          case BOOL_TYPE:
              if(tree->i == 0){
                  printf("#f");
              }else if(tree->i == 1){
                  printf("#t");
              }
              break;
          case SYMBOL_TYPE:
              printf("%s", tree->s);
              break;
          case OPEN_TYPE:
              break;
          case CLOSE_TYPE:
              break;
          case OPENBRACKET_TYPE:
              break;
          case CLOSEBRACKET_TYPE:
              break;
          case SINGLEQUOTE_TYPE:
              break;
          case DOT_TYPE:
            break;
          case CONS_TYPE:
            printf("(");
              while(cur->type == CONS_TYPE){
                      printInterpret(car(cur));
                      if (cdr(cur)->type != NULL_TYPE){
                          printf(" ");
                      }
                  cur = cdr(cur);
              }
            if(cur->type != NULL_TYPE){
                printf(". ");
                printInterpret(cur);
            }
            printf(")");
              break;
          case NULL_TYPE:
              printf("()");
              break;
          case PTR_TYPE:
              break;
          case VOID_TYPE:
              printf("VOID_TYPE");
              break;
          default:
              break;
      }
}

void interpret(Value *tree){
    Value *cur = tree;
    Frame *global = talloc(sizeof(Frame));
    global->parent = NULL;
    global->bindings = makeNull();
    bind("+", primitiveAdd, global);
    bind("null?", primitiveNull, global);
    bind("car", primitiveCar, global);
    bind("cdr", primitiveCdr, global);
    bind("cons", primitiveCons, global);
    bind("-", primitiveSubtract, global);
    bind("*", primitiveMultiply, global);
    bind("/", primitiveDivide, global);
    bind("<", primitiveLessThan, global);
    bind(">", primitiveGreaterThan, global);
    bind("=", primitiveEqual, global);
    bind("modulo", primitiveModulo, global);

    while(!isNull(cur)){
        printInterpret(eval(car(cur), global));
        printf("\n");
        cur = cdr(cur);
    }
}
