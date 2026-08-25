# Python Syntax Reference — Elzero Lessons 20 → 74

> A compact practical reference for the most important syntax used in lessons 20 to 74 of the Mastering Python course.
>
> Goal: use this file as a **Cheat Sheet / Quick Reference** while studying and writing in VS Code.

---

# 1) Arithmetic Operators

```python
a + b     # Addition
a - b     # Subtraction
a * b     # Multiplication
a / b     # Division -> float
a // b    # Floor Division
a % b     # Modulus / Remainder
a ** b    # Exponent / Power
```

## Examples

```python
print(10 + 5)    # 15
print(10 - 5)    # 5
print(10 * 5)    # 50
print(10 / 5)    # 2.0
print(10 // 3)   # 3
print(10 % 3)    # 1
print(2 ** 3)    # 8
```

## Operator precedence

```python
result = 5 + 10 * 2
# Multiplication before addition
```

Use parentheses to define the order:

```python
result = (5 + 10) * 2
```

---

# 2) Lists

## Creating a List

```python
items = [1, 2, 3, "Python", True]
```

## Access / Index

```python
items[0]
items[1]
items[-1]
items[-2]
```

## Slicing

```python
items[start:end]
items[start:end:step]
```

Examples:

```python
items[1:4]
items[:4]
items[2:]
items[::2]
items[::-1]
```

> `end` is excluded.

## Updating an item

```python
items[0] = "New Value"
```

## Updating a slice

```python
items[1:3] = ["A", "B"]
```

---

# 3) List Methods

## append()

Add one item at the end:

```python
items.append("Python")
```

## extend()

Add iterable items:

```python
items.extend([4, 5, 6])
```

## remove()

Remove the first matching value:

```python
items.remove("Python")
```

## sort()

```python
numbers.sort()
numbers.sort(reverse=True)
```

## reverse()

Reverse item order:

```python
items.reverse()
```

## clear()

```python
items.clear()
```

## copy()

```python
new_items = items.copy()
```

## count()

```python
items.count("Python")
```

## index()

```python
items.index("Python")
```

## insert()

```python
items.insert(index, value)
```

Example:

```python
items.insert(0, "Start")
```

## pop()

```python
items.pop()
items.pop(2)
```

And return the deleted item:

```python
deleted = items.pop(2)
```

---

# 4) Tuples

## Creating a Tuple

```python
data = (1, 2, 3)
```

Or:

```python
data = 1, 2, 3
```

## One-item Tuple

```python
data = ("Python",)
```

The important point is the comma:

```python
("Python",)
```

## Access

```python
data[0]
data[-1]
```

## Immutable Tuple

```python
# data[0] = 100
# TypeError
```

## Concatenation

```python
a = (1, 2)
b = (3, 4)

c = a + b
```

## Repeat

```python
data * 3
```

## count()

```python
data.count(2)
```

## index()

```python
data.index(3)
```

## Tuple Unpacking

```python
name, age, country = ("Ahmed", 25, "Egypt")
```

Ignore a value:

```python
name, _, country = ("Ahmed", 25, "Egypt")
```

---

# 5) Sets

## Creating a Set

```python
numbers = {1, 2, 3}
```

## Important properties

- Unordered
- Unique Values
- No Indexing
- No Slicing

## clear()

```python
numbers.clear()
```

## union()

```python
a.union(b)
a | b
```

## add()

```python
numbers.add(4)
```

## copy()

```python
new_set = numbers.copy()
```

## remove()

```python
numbers.remove(2)
```

> Raises an error if the item is missing.

## discard()

```python
numbers.discard(2)
```

> Does not raise an error if the item is missing.

## pop()

```python
numbers.pop()
```

## update()

```python
numbers.update([4, 5, 6])
```

---

# 6) Set Operations

## difference()

Items in `a` that are not in `b`:

```python
a.difference(b)
a - b
```

## difference_update()

Changes `a` itself:

```python
a.difference_update(b)
```

## intersection()

Shared items:

```python
a.intersection(b)
a & b
```

## intersection_update()

```python
a.intersection_update(b)
```

## symmetric_difference()

Items that are not shared:

```python
a.symmetric_difference(b)
a ^ b
```

## symmetric_difference_update()

```python
a.symmetric_difference_update(b)
```

## issuperset()

```python
a.issuperset(b)
```

Does `a` contain every item in `b`?

## issubset()

```python
a.issubset(b)
```

Is `a` a part of `b`?

## isdisjoint()

```python
a.isdisjoint(b)
```

Are there no shared items?

---

# 7) Dictionaries

## Creating a Dictionary

```python
user = {
    "name": "Ahmed",
    "age": 25,
    "country": "Egypt"
}
```

## Access

```python
user["name"]
```

Or:

```python
user.get("name")
```

## Difference between [] and get()

```python
user["missing"]
# KeyError
```

But:

```python
user.get("missing")
# None
```

## Add / Update Key

```python
user["skill"] = "Python"
```

Or:

```python
user.update({"skill": "Python"})
```

## Nested Dictionary

```python
languages = {
    "python": {
        "level": "Advanced",
        "progress": 90
    }
}
```

Access:

```python
languages["python"]["progress"]
```

---

# 8) Dictionary Methods

## clear()

```python
user.clear()
```

## update()

```python
user.update({"country": "Egypt"})
```

## copy()

```python
new_user = user.copy()
```

## keys()

```python
user.keys()
```

## values()

```python
user.values()
```

## items()

```python
user.items()
```

## setdefault()

```python
user.setdefault("country", "Egypt")
```

If the key exists, return its value; if it is missing, add it.

## popitem()

```python
user.popitem()
```

Remove and return the last key/value pair.

## fromkeys()

```python
keys = ("name", "age", "country")

user = dict.fromkeys(keys, "Unknown")
```

---

# 9) Boolean

Values:

```python
True
False
```

## bool()

```python
bool(value)
```

### Usually Truthy

```python
bool("Python")
bool(100)
bool([1, 2])
```

### Usually Falsy

```python
bool("")
bool(0)
bool([])
bool({})
bool(())
bool(None)
bool(False)
```

---

# 10) Boolean Operators

## and

All conditions must be True:

```python
age >= 18 and country == "Egypt"
```

## or

One True condition is enough:

```python
age >= 18 or has_permission
```

## not

Reverse the result:

```python
not age > 18
```

---

# 11) Assignment Operators

```python
x = 10

x += 5
x -= 5
x *= 2
x /= 2
x //= 2
x %= 3
x **= 2
```

Example:

```python
x += 5
```

Same as:

```python
x = x + 5
```

---

# 12) Comparison Operators

```python
a == b   # Equal
a != b   # Not Equal
a > b
a < b
a >= b
a <= b
```

## Important

```python
x = 10
```

This is assignment.

```python
x == 10
```

This is comparison.

---

# 13) Type Conversion

## To String

```python
str(value)
```

## To Integer

```python
int(value)
```

## To Float

```python
float(value)
```

## To List

```python
list(value)
```

## To Tuple

```python
tuple(value)
```

## To Set

```python
set(value)
```

Example:

```python
number = int("100")
```

---

# 14) User Input

## Basic Input

```python
name = input("Enter Your Name: ")
```

> `input()` always returns a String.

## Input + Conversion

```python
age = int(input("Enter Your Age: "))
```

## Input + Cleaning

```python
name = input("Name: ").strip().capitalize()
```

---

# 15) String Processing Used in This Stage

## strip()

```python
text.strip()
```

Remove leading and trailing spaces.

## lower()

```python
text.lower()
```

## upper()

```python
text.upper()
```

## capitalize()

```python
text.capitalize()
```

## index()

```python
text.index("@")
```

Return the value's position.

## Slicing

```python
text[start:end]
```

Example:

```python
email = "ahmed@gmail.com"

username = email[:email.index("@")]
```

---

# 16) If / Elif / Else

## Basic Syntax

```python
if condition:
    code

elif another_condition:
    code

else:
    code
```

Example:

```python
age = 20

if age >= 18:
    print("Adult")

else:
    print("Minor")
```

## Multiple elif branches

```python
if score >= 90:
    print("A")

elif score >= 80:
    print("B")

elif score >= 70:
    print("C")

else:
    print("Fail")
```

---

# 17) Indentation

Python relies on indentation.

Correct:

```python
if True:
    print("Hello")
```

Incorrect:

```python
# if True:
# print("Hello")
```

Best practice:

```text
4 spaces
```

---

# 18) Nested If

```python
if condition:

    if another_condition:
        code

    else:
        code

else:
    code
```

Example:

```python
if age >= 18:

    if has_license:
        print("Can Drive")

    else:
        print("Need License")
```

---

# 19) Ternary Conditional Operator

Form:

```python
value_if_true if condition else value_if_false
```

Example:

```python
status = "Adult" if age >= 18 else "Minor"
```

Or:

```python
print("Allowed" if age >= 18 else "Not Allowed")
```

---

# 20) Membership Operators

```python
in
not in
```

Examples:

```python
"Ahmed" in friends
"Omar" not in friends
```

With a String:

```python
"P" in "Python"
```

With a Dictionary:

```python
"name" in user
```

> In a Dictionary, the check is performed on keys.

---

# 21) While Loop

## Basic Syntax

```python
while condition:
    code
```

Example:

```python
x = 0

while x < 5:
    print(x)
    x += 1
```

## While + Else

```python
while condition:
    code

else:
    code
```

## Infinite Loop

If the condition never becomes False:

```python
# x = 0
# while x < 5:
#     print(x)
```

Because `x` did not change.

---

# 22) for Loop

## Basic Syntax

```python
for item in iterable:
    code
```

Example:

```python
for name in ["Ahmed", "Ali", "Omar"]:
    print(name)
```

With a String:

```python
for letter in "Python":
    print(letter)
```

## for + else

```python
for item in items:
    print(item)

else:
    print("Loop Finished")
```

---

# 23) Nested Loops

```python
for item in items:

    for sub_item in sub_items:
        code
```

Example:

```python
for person in people:

    for skill in skills:
        print(person, skill)
```

---

# 24) Loop Control Statements

## break

Stop the entire loop:

```python
for number in numbers:

    if number == 5:
        break
```

## continue

Skip the current cycle:

```python
for number in numbers:

    if number == 5:
        continue

    print(number)
```

## pass

Placeholder:

```python
if condition:
    pass
```

---

# 25) Looping Over Dictionary

## Keys

```python
for key in user:
    print(key)
```

## Values

```python
for value in user.values():
    print(value)
```

## Keys + Values

```python
for key, value in user.items():
    print(key, value)
```

---

# 26) Functions

## Basic Syntax

```python
def function_name():
    code
```

Call:

```python
function_name()
```

Example:

```python
def say_hello():
    print("Hello")

say_hello()
```

---

# 27) return

```python
def function_name():
    return value
```

Example:

```python
def add():
    return 10 + 20

result = add()
```

## Difference between print and return

```python
print(value)
```

Displays the value.

```python
return value
```

Returns the value from the function.

---

# 28) Parameters & Arguments

## Parameter

```python
def say_hello(name):
    print(name)
```

`name` = Parameter.

## Argument

```python
say_hello("Ahmed")
```

`"Ahmed"` = Argument.

## Multiple parameters

```python
def user_info(name, age, country):
    pass
```

Call:

```python
user_info("Ahmed", 25, "Egypt")
```

---

# 29) Default Parameters

```python
def say_hello(name="Unknown"):
    print(name)
```

```python
say_hello()
say_hello("Ahmed")
```

## Important rule

Required parameters before default parameters:

Correct:

```python
def user_info(name, age=20):
    pass
```

Incorrect:

```python
# def user_info(name="Unknown", age):
#     pass
```

---

# 30) *args

Packs positional arguments into a Tuple:

```python
def show_names(*names):
    print(names)
```

Call:

```python
show_names("Ahmed", "Ali", "Omar")
```

Result:

```python
("Ahmed", "Ali", "Omar")
```

Loop:

```python
def show_names(*names):

    for name in names:
        print(name)
```

---

# 31) Unpacking with *

```python
skills = ["Python", "HTML", "CSS"]
```

Function:

```python
def show_skills(a, b, c):
    print(a, b, c)
```

Call:

```python
show_skills(*skills)
```

Equivalent to:

```python
show_skills(
    skills[0],
    skills[1],
    skills[2]
)
```

---

# 32) **kwargs

Packs keyword arguments into a Dictionary:

```python
def show_data(**data):
    print(data)
```

Call:

```python
show_data(
    name="Ahmed",
    age=25,
    country="Egypt"
)
```

---

# 33) Unpacking Dictionary with **

```python
user = {
    "name": "Ahmed",
    "age": 25
}
```

```python
def show_data(**data):
    print(data)
```

```python
show_data(**user)
```

---

# 34) Combining Parameters, *args, **kwargs

```python
def show_data(name, *skills, **progress):

    print(name)

    for skill in skills:
        print(skill)

    for skill, value in progress.items():
        print(skill, value)
```

Call:

```python
show_data(
    "Ahmed",
    "HTML",
    "CSS",
    Python="90%",
    JavaScript="80%"
)
```

---

# 35) Scope

## Global Variable

```python
x = 100
```

## Local Variable

```python
def test():
    x = 50
```

The `x` inside the function is different from the outer one.

## global

```python
x = 100

def change():

    global x
    x = 500
```

Afterward, the outer `x` becomes `500`.

---

# 36) Recursion

The function calls itself:

```python
def countdown(number):

    if number == 0:
        return

    print(number)

    countdown(number - 1)
```

## Base Case

There must be a condition that stops recursion:

```python
if number == 0:
    return
```

---

# 37) Lambda

## Basic Syntax

```python
lambda arguments: expression
```

Example:

```python
add = lambda a, b: a + b
```

Call:

```python
print(add(10, 20))
```

Approximately equivalent to:

```python
def add(a, b):
    return a + b
```

---

# 38) File Handling — open()

## Syntax

```python
file = open("filename.txt", "mode")
```

## Common modes

```text
r  Read
w  Write
a  Append
x  Create
```

Examples:

```python
file = open("data.txt", "r")
file = open("data.txt", "w")
file = open("data.txt", "a")
file = open("data.txt", "x")
```

---

# 39) Reading Files

## read()

```python
file.read()
```

Number of characters:

```python
file.read(10)
```

## readline()

```python
file.readline()
```

## readlines()

```python
file.readlines()
```

Returns a List of lines.

## Loop over a file

```python
for line in file:
    print(line)
```

## close()

```python
file.close()
```

---

# 40) Writing Files

## write()

```python
file = open("data.txt", "w")

file.write("Hello")

file.close()
```

## New Line

```python
file.write("Ahmed\n")
```

## writelines()

```python
lines = [
    "Ahmed\n",
    "Ali\n",
    "Omar\n"
]

file.writelines(lines)
```

---

# 41) Append Files

```python
file = open("data.txt", "a")

file.write("New Line\n")

file.close()
```

Difference:

```text
w -> writes from the beginning and may erase old content
a -> adds at the end
```

---

# 42) File Cursor

## tell()

Tells you the cursor position:

```python
file.tell()
```

## seek()

Moves the cursor:

```python
file.seek(position)
```

Example:

```python
file.seek(0)
```

Moves it back to the beginning.

## truncate()

```python
file.truncate(size)
```

Truncates the file size.

---

# 43) os.remove()

```python
import os

os.remove("data.txt")
```

Deletes the file.

---

# 44) Built-in Function: all()

```python
all(iterable)
```

Returns `True` if every item is Truthy.

```python
all([1, 2, 3])
# True
```

```python
all([1, 0, 3])
# False
```

---

# 45) Built-in Function: any()

```python
any(iterable)
```

Returns `True` if at least one item is Truthy.

```python
any([0, False, "", 10])
# True
```

---

# 46) Built-in Function: bin()

```python
bin(number)
```

Example:

```python
bin(10)
# '0b1010'
```

---

# 47) Built-in Function: id()

```python
id(object)
```

Example:

```python
x = 100

print(id(x))
```

---

# 48) Built-in Function: sum()

```python
sum(iterable)
```

Example:

```python
sum([10, 20, 30])
```

Starting Value:

```python
sum([10, 20, 30], 100)
```

---

# 49) Built-in Function: round()

```python
round(number)
```

Number of decimal places:

```python
round(number, digits)
```

Example:

```python
round(10.5678, 2)
```

---

# 50) Built-in Function: range()

## Basic

```python
range(stop)
```

```python
range(10)
```

## Start / Stop

```python
range(start, stop)
```

```python
range(1, 10)
```

## Start / Stop / Step

```python
range(start, stop, step)
```

```python
range(0, 20, 2)
```

Usually:

```python
for number in range(10):
    print(number)
```

---

# 51) print() Advanced

## sep

```python
print("A", "B", "C", sep=" | ")
```

## end

```python
print("Hello", end=" ")
print("Python")
```

---

# 52) Built-in Function: abs()

```python
abs(number)
```

Example:

```python
abs(-100)
# 100
```

---

# 53) Built-in Function: pow()

```python
pow(base, exponent)
```

Example:

```python
pow(2, 5)
```

Same as:

```python
2 ** 5
```

---

# 54) Built-in Function: min()

```python
min(iterable)
```

Or:

```python
min(a, b, c)
```

Example:

```python
min([10, 5, 20])
```

---

# 55) Built-in Function: max()

```python
max(iterable)
```

Or:

```python
max(a, b, c)
```

---

# 56) slice()

Create a slice object:

```python
slice(start, stop, step)
```

Example:

```python
text = "Programming"

part = slice(0, 5)

print(text[part])
```

---

# 57) map()

## Syntax

```python
map(function, iterable)
```

Example:

```python
numbers = [1, 2, 3, 4]

result = map(lambda x: x * 2, numbers)

print(list(result))
```

Goal:

> Apply a function to every item.

---

# 58) filter()

## Syntax

```python
filter(function, iterable)
```

Example:

```python
numbers = [1, 2, 3, 4, 5, 6]

result = filter(
    lambda x: x % 2 == 0,
    numbers
)

print(list(result))
```

Goal:

> Keep items for which the condition returns True.

---

# 59) reduce()

Requires an import:

```python
from functools import reduce
```

## Syntax

```python
reduce(function, iterable)
```

Example:

```python
numbers = [1, 2, 3, 4]

result = reduce(
    lambda x, y: x + y,
    numbers
)

print(result)
```

Goal:

> Convert a group of items into one value.

---

# 60) Map vs Filter vs Reduce

## map

```python
map(function, iterable)
```

Transforms every item.

## filter

```python
filter(function, iterable)
```

Selects items.

## reduce

```python
reduce(function, iterable)
```

Reduces all items to one value.

Quick example:

```python
numbers = [1, 2, 3, 4, 5]

mapped = list(map(lambda x: x * 2, numbers))

filtered = list(filter(lambda x: x > 2, numbers))

from functools import reduce

reduced = reduce(lambda x, y: x + y, numbers)
```

---

# 61) Important patterns to remember

## Input → Clean → Convert

```python
age = int(input("Enter Age: ").strip())
```

## If

```python
if condition:
    code

elif condition:
    code

else:
    code
```

## While

```python
while condition:
    code
    update
```

## For

```python
for item in iterable:
    code
```

## Dictionary Loop

```python
for key, value in data.items():
    print(key, value)
```

## Function

```python
def function_name(parameter):
    return value
```

## Function with *args

```python
def function_name(*args):
    pass
```

## Function with **kwargs

```python
def function_name(**kwargs):
    pass
```

## File Read

```python
file = open("data.txt", "r")

content = file.read()

file.close()
```

## File Write

```python
file = open("data.txt", "w")

file.write("Hello")

file.close()
```

## Map

```python
list(map(lambda x: expression, iterable))
```

## Filter

```python
list(filter(lambda x: condition, iterable))
```

## Reduce

```python
from functools import reduce

reduce(lambda x, y: expression, iterable)
```

---

# 62) Common mistakes in this stage

## Forgetting the colon :

Incorrect:

```python
# if age > 18
#     print("Adult")
```

Correct:

```python
if age > 18:
    print("Adult")
```

---

## Incorrect indentation

```python
if True:
    print("Correct")
```

---

## Using = instead of ==

Incorrect:

```python
# if age = 18:
#     pass
```

Correct:

```python
if age == 18:
    pass
```

---

## Forgetting to update while

```python
x = 0

while x < 5:
    print(x)
    x += 1
```

---

## Forgetting return

```python
def add(a, b):
    return a + b
```

---

## Using a missing key with []

```python
user["missing"]
```

It may raise `KeyError`.

Safer:

```python
user.get("missing")
```

---

## remove() on a missing item

```python
items.remove("Missing")
```

It may raise an error.

For a Set, use:

```python
items.discard("Missing")
```

If you do not want an error.

---

## Mutable vs Immutable

Mutable:

```text
list
dict
set
```

Immutable:

```text
int
float
str
tuple
bool
```

---

# 63) Mini Syntax Index

## Operators

```text
+ - * / // % **
== != > < >= <=
and or not
in not in
+= -= *= /= //= %= **=
```

## Data Structures

```python
[]
()
{}
{"key": "value"}
```

## Control Flow

```python
if
elif
else
```

## Loops

```python
while
for
break
continue
pass
```

## Functions

```python
def
return
*args
**kwargs
lambda
global
```

## Files

```python
open()
read()
readline()
readlines()
write()
writelines()
close()
tell()
seek()
truncate()
```

## Built-ins

```python
bool()
str()
int()
float()
list()
tuple()
set()
len()
all()
any()
bin()
id()
sum()
round()
range()
abs()
pow()
min()
max()
slice()
map()
filter()
```

## Import Used

```python
import os
```

```python
from functools import reduce
```

---

# 64) Ultra Quick Cheat Sheet

```python
# List
items = [1, 2, 3]
items.append(4)

# Tuple
data = (1, 2, 3)

# Set
unique = {1, 2, 3}

# Dict
user = {"name": "Ahmed"}

# Input
name = input("Name: ").strip()

# Condition
if name == "Ahmed":
    print("Welcome")
else:
    print("Unknown")

# For
for item in items:
    print(item)

# While
x = 0

while x < 5:
    print(x)
    x += 1

# Function
def add(a, b):
    return a + b

# *args
def total(*numbers):
    return sum(numbers)

# **kwargs
def show(**data):
    print(data)

# Lambda
double = lambda x: x * 2

# File
file = open("data.txt", "r")
content = file.read()
file.close()

# Map
mapped = list(map(lambda x: x * 2, items))

# Filter
filtered = list(filter(lambda x: x > 1, items))

# Reduce
from functools import reduce

result = reduce(lambda x, y: x + y, items)
```

---

# 65) Quick review rule

When you see:

```python
[]
```

Think of:

```text
List / Index / Slicing
```

When you see:

```python
()
```

Think of:

```text
Tuple or function call
```

When you see:

```python
{}
```

Think of:

```text
Set or Dictionary
```

When you see:

```python
:
```

After:

```text
if / elif / else / while / for / def
```

you are inside a block that needs indentation.

When you see:

```python
*
```

with function arguments:

```python
*args
```

think of positional arguments.

When you see:

```python
**
```

with function arguments:

```python
**kwargs
```

think of keyword arguments.

---

# 66) Quick mental model

## List

```text
An ordered, mutable collection
```

## Tuple

```text
An ordered, immutable collection
```

## Set

```text
A unique, unordered collection
```

## Dictionary

```text
Key -> Value
```

## if

```text
Making a decision
```

## Loop

```text
Repetition
```

## Function

```text
Reusing a piece of logic
```

## return

```text
Returning a value from a function
```

## map

```text
Transform
```

## filter

```text
Select
```

## reduce

```text
Combine
```

---

# 67) The best way to use this reference

1. Look at the general syntax.
2. Write an example yourself without copy/paste.
3. Change the values.
4. Predict the output before running it.
5. Trigger an error intentionally and understand why.
6. Return to the reference only when you forget the syntax shape.

---

# End of reference

This file covers the core syntax used approximately in lessons:

```text
20 → 74
```

From:

```text
Arithmetic Operators
```

To:

```text
reduce()
```
