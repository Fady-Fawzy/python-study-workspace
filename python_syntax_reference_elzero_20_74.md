# Python Syntax Reference — Elzero Lessons 20 → 74

> مرجع عملي سريع ومكثف لأهم الـSyntax المستخدمة من الفيديو 20 إلى 74 في كورس Mastering Python.
>
> الهدف: تستخدم الملف كـ **Cheat Sheet / Quick Reference** أثناء المذاكرة والكتابة في VS Code.

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

## أمثلة

```python
print(10 + 5)    # 15
print(10 - 5)    # 5
print(10 * 5)    # 50
print(10 / 5)    # 2.0
print(10 // 3)   # 3
print(10 % 3)    # 1
print(2 ** 3)    # 8
```

## أولوية العمليات

```python
result = 5 + 10 * 2
# الضرب قبل الجمع
```

استخدم الأقواس لتحديد الأولوية:

```python
result = (5 + 10) * 2
```

---

# 2) Lists

## إنشاء List

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

أمثلة:

```python
items[1:4]
items[:4]
items[2:]
items[::2]
items[::-1]
```

> `end` غير مشمول.

## تعديل عنصر

```python
items[0] = "New Value"
```

## تعديل Slice

```python
items[1:3] = ["A", "B"]
```

---

# 3) List Methods

## append()

إضافة عنصر واحد في النهاية:

```python
items.append("Python")
```

## extend()

إضافة عناصر Iterable:

```python
items.extend([4, 5, 6])
```

## remove()

يحذف أول قيمة مطابقة:

```python
items.remove("Python")
```

## sort()

```python
numbers.sort()
numbers.sort(reverse=True)
```

## reverse()

يعكس ترتيب العناصر:

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

مثال:

```python
items.insert(0, "Start")
```

## pop()

```python
items.pop()
items.pop(2)
```

ويرجع العنصر المحذوف:

```python
deleted = items.pop(2)
```

---

# 4) Tuples

## إنشاء Tuple

```python
data = (1, 2, 3)
```

أو:

```python
data = 1, 2, 3
```

## Tuple بعنصر واحد

```python
data = ("Python",)
```

النقطة المهمة هي الفاصلة:

```python
("Python",)
```

## Access

```python
data[0]
data[-1]
```

## Tuple غير قابلة للتعديل

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

تجاهل قيمة:

```python
name, _, country = ("Ahmed", 25, "Egypt")
```

---

# 5) Sets

## إنشاء Set

```python
numbers = {1, 2, 3}
```

## خصائص مهمة

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

> يعمل Error لو العنصر غير موجود.

## discard()

```python
numbers.discard(2)
```

> لا يعمل Error لو العنصر غير موجود.

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

العناصر الموجودة في `a` وغير الموجودة في `b`:

```python
a.difference(b)
a - b
```

## difference_update()

يعدل `a` نفسها:

```python
a.difference_update(b)
```

## intersection()

العناصر المشتركة:

```python
a.intersection(b)
a & b
```

## intersection_update()

```python
a.intersection_update(b)
```

## symmetric_difference()

العناصر غير المشتركة:

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

هل `a` تحتوي كل عناصر `b`؟

## issubset()

```python
a.issubset(b)
```

هل `a` جزء من `b`؟

## isdisjoint()

```python
a.isdisjoint(b)
```

هل لا يوجد أي عنصر مشترك؟

---

# 7) Dictionaries

## إنشاء Dictionary

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

أو:

```python
user.get("name")
```

## الفرق بين [] و get()

```python
user["missing"]
# KeyError
```

لكن:

```python
user.get("missing")
# None
```

## Add / Update Key

```python
user["skill"] = "Python"
```

أو:

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

لو الـKey موجود يرجع قيمته، ولو مش موجود يضيفه.

## popitem()

```python
user.popitem()
```

يحذف ويرجع آخر Key/Value Pair.

## fromkeys()

```python
keys = ("name", "age", "country")

user = dict.fromkeys(keys, "Unknown")
```

---

# 9) Boolean

القيم:

```python
True
False
```

## bool()

```python
bool(value)
```

### غالبًا Truthy

```python
bool("Python")
bool(100)
bool([1, 2])
```

### غالبًا Falsy

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

كل الشروط لازم True:

```python
age >= 18 and country == "Egypt"
```

## or

يكفي شرط واحد True:

```python
age >= 18 or has_permission
```

## not

يعكس النتيجة:

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

مثال:

```python
x += 5
```

نفس:

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

## مهم

```python
x = 10
```

دي Assignment.

```python
x == 10
```

دي Comparison.

---

# 13) Type Conversion

## إلى String

```python
str(value)
```

## إلى Integer

```python
int(value)
```

## إلى Float

```python
float(value)
```

## إلى List

```python
list(value)
```

## إلى Tuple

```python
tuple(value)
```

## إلى Set

```python
set(value)
```

مثال:

```python
number = int("100")
```

---

# 14) User Input

## Basic Input

```python
name = input("Enter Your Name: ")
```

> `input()` يرجع String دائمًا.

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

يحذف المسافات من البداية والنهاية.

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

يرجع موقع القيمة.

## Slicing

```python
text[start:end]
```

مثال:

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

مثال:

```python
age = 20

if age >= 18:
    print("Adult")

else:
    print("Minor")
```

## أكثر من elif

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

Python تعتمد على الـIndentation.

صح:

```python
if True:
    print("Hello")
```

خطأ:

```python
# if True:
# print("Hello")
```

أفضل ممارسة:

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

مثال:

```python
if age >= 18:

    if has_license:
        print("Can Drive")

    else:
        print("Need License")
```

---

# 19) Ternary Conditional Operator

الشكل:

```python
value_if_true if condition else value_if_false
```

مثال:

```python
status = "Adult" if age >= 18 else "Minor"
```

أو:

```python
print("Allowed" if age >= 18 else "Not Allowed")
```

---

# 20) Membership Operators

```python
in
not in
```

أمثلة:

```python
"Ahmed" in friends
"Omar" not in friends
```

مع String:

```python
"P" in "Python"
```

مع Dictionary:

```python
"name" in user
```

> في Dictionary يتم الفحص على الـKeys.

---

# 21) While Loop

## Basic Syntax

```python
while condition:
    code
```

مثال:

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

لو الشرط عمره ما يبقى False:

```python
# x = 0
# while x < 5:
#     print(x)
```

لأن `x` لم تتغير.

---

# 22) for Loop

## Basic Syntax

```python
for item in iterable:
    code
```

مثال:

```python
for name in ["Ahmed", "Ali", "Omar"]:
    print(name)
```

مع String:

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

مثال:

```python
for person in people:

    for skill in skills:
        print(person, skill)
```

---

# 24) Loop Control Statements

## break

يوقف الـLoop بالكامل:

```python
for number in numbers:

    if number == 5:
        break
```

## continue

يتخطى الدورة الحالية:

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

مثال:

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

مثال:

```python
def add():
    return 10 + 20

result = add()
```

## الفرق بين print و return

```python
print(value)
```

يعرض القيمة.

```python
return value
```

يرجع القيمة من الـFunction.

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

## أكثر من Parameter

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

## قاعدة مهمة

Required Parameters قبل Default Parameters:

صح:

```python
def user_info(name, age=20):
    pass
```

خطأ:

```python
# def user_info(name="Unknown", age):
#     pass
```

---

# 30) *args

يجمع Positional Arguments داخل Tuple:

```python
def show_names(*names):
    print(names)
```

Call:

```python
show_names("Ahmed", "Ali", "Omar")
```

النتيجة:

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

تعادل:

```python
show_skills(
    skills[0],
    skills[1],
    skills[2]
)
```

---

# 32) **kwargs

يجمع Keyword Arguments داخل Dictionary:

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

الـ`x` داخل Function مختلفة عن الخارجية.

## global

```python
x = 100

def change():

    global x
    x = 500
```

بعدها `x` الخارجية أصبحت `500`.

---

# 36) Recursion

Function تنادي نفسها:

```python
def countdown(number):

    if number == 0:
        return

    print(number)

    countdown(number - 1)
```

## Base Case

لازم يكون فيه شرط يوقف الـRecursion:

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

مثال:

```python
add = lambda a, b: a + b
```

Call:

```python
print(add(10, 20))
```

Equivalent تقريبًا:

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

## أشهر Modes

```text
r  Read
w  Write
a  Append
x  Create
```

أمثلة:

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

عدد Characters:

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

ترجع List من الأسطر.

## Loop على File

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

الفرق:

```text
w -> يكتب من البداية وقد يمسح القديم
a -> يضيف في النهاية
```

---

# 42) File Cursor

## tell()

يعرفك مكان الـCursor:

```python
file.tell()
```

## seek()

ينقل الـCursor:

```python
file.seek(position)
```

مثال:

```python
file.seek(0)
```

يرجعه للبداية.

## truncate()

```python
file.truncate(size)
```

يقص حجم الملف.

---

# 43) os.remove()

```python
import os

os.remove("data.txt")
```

يحذف الملف.

---

# 44) Built-in Function: all()

```python
all(iterable)
```

ترجع `True` لو كل العناصر Truthy.

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

ترجع `True` لو عنصر واحد على الأقل Truthy.

```python
any([0, False, "", 10])
# True
```

---

# 46) Built-in Function: bin()

```python
bin(number)
```

مثال:

```python
bin(10)
# '0b1010'
```

---

# 47) Built-in Function: id()

```python
id(object)
```

مثال:

```python
x = 100

print(id(x))
```

---

# 48) Built-in Function: sum()

```python
sum(iterable)
```

مثال:

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

عدد Decimal Places:

```python
round(number, digits)
```

مثال:

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

غالبًا:

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

مثال:

```python
abs(-100)
# 100
```

---

# 53) Built-in Function: pow()

```python
pow(base, exponent)
```

مثال:

```python
pow(2, 5)
```

نفس:

```python
2 ** 5
```

---

# 54) Built-in Function: min()

```python
min(iterable)
```

أو:

```python
min(a, b, c)
```

مثال:

```python
min([10, 5, 20])
```

---

# 55) Built-in Function: max()

```python
max(iterable)
```

أو:

```python
max(a, b, c)
```

---

# 56) slice()

إنشاء Slice Object:

```python
slice(start, stop, step)
```

مثال:

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

مثال:

```python
numbers = [1, 2, 3, 4]

result = map(lambda x: x * 2, numbers)

print(list(result))
```

الهدف:

> تطبيق Function على كل عنصر.

---

# 58) filter()

## Syntax

```python
filter(function, iterable)
```

مثال:

```python
numbers = [1, 2, 3, 4, 5, 6]

result = filter(
    lambda x: x % 2 == 0,
    numbers
)

print(list(result))
```

الهدف:

> الاحتفاظ بالعناصر التي يرجع لها الشرط True.

---

# 59) reduce()

تحتاج Import:

```python
from functools import reduce
```

## Syntax

```python
reduce(function, iterable)
```

مثال:

```python
numbers = [1, 2, 3, 4]

result = reduce(
    lambda x, y: x + y,
    numbers
)

print(result)
```

الهدف:

> تحويل مجموعة عناصر إلى قيمة واحدة.

---

# 60) Map vs Filter vs Reduce

## map

```python
map(function, iterable)
```

يحوّل كل عنصر.

## filter

```python
filter(function, iterable)
```

يختار عناصر.

## reduce

```python
reduce(function, iterable)
```

يختزل كل العناصر لقيمة واحدة.

مثال سريع:

```python
numbers = [1, 2, 3, 4, 5]

mapped = list(map(lambda x: x * 2, numbers))

filtered = list(filter(lambda x: x > 2, numbers))

from functools import reduce

reduced = reduce(lambda x, y: x + y, numbers)
```

---

# 61) أهم Patterns لازم تحفظ شكلها

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

# 62) أشهر الأخطاء في المرحلة دي

## نسيان النقطتين :

خطأ:

```python
# if age > 18
#     print("Adult")
```

صح:

```python
if age > 18:
    print("Adult")
```

---

## Indentation غلط

```python
if True:
    print("Correct")
```

---

## استخدام = بدل ==

خطأ:

```python
# if age = 18:
#     pass
```

صح:

```python
if age == 18:
    pass
```

---

## نسيان تحديث while

```python
x = 0

while x < 5:
    print(x)
    x += 1
```

---

## نسيان return

```python
def add(a, b):
    return a + b
```

---

## استخدام Key غير موجود بـ []

```python
user["missing"]
```

ممكن يعمل `KeyError`.

الأكثر أمانًا:

```python
user.get("missing")
```

---

## remove() على عنصر غير موجود

```python
items.remove("Missing")
```

قد يعمل Error.

في Set استخدم:

```python
items.discard("Missing")
```

لو لا تريد Error.

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

# 65) قاعدة مراجعة سريعة

لو شفت:

```python
[]
```

فكر في:

```text
List / Index / Slicing
```

لو شفت:

```python
()
```

فكر في:

```text
Tuple أو Function Call
```

لو شفت:

```python
{}
```

فكر في:

```text
Set أو Dictionary
```

لو شفت:

```python
:
```

بعد:

```text
if / elif / else / while / for / def
```

فأنت داخل Block يحتاج Indentation.

لو شفت:

```python
*
```

مع Function Arguments:

```python
*args
```

فكر في Positional Arguments.

لو شفت:

```python
**
```

مع Function Arguments:

```python
**kwargs
```

فكر في Keyword Arguments.

---

# 66) Mental Model سريع

## List

```text
مجموعة مرتبة وقابلة للتعديل
```

## Tuple

```text
مجموعة مرتبة وغير قابلة للتعديل
```

## Set

```text
مجموعة Unique وغير مرتبة
```

## Dictionary

```text
Key -> Value
```

## if

```text
اتخاذ قرار
```

## Loop

```text
تكرار
```

## Function

```text
إعادة استخدام منطق معين
```

## return

```text
إخراج قيمة من Function
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

# 67) أفضل طريقة لاستخدام المرجع

1. شوف الـSyntax العامة.
2. اكتب مثال بنفسك بدون Copy/Paste.
3. غيّر القيم.
4. توقّع الناتج قبل Run.
5. جرّب Error عمدًا وافهم سببه.
6. ارجع للمرجع فقط لما تنسى شكل الـSyntax.

---

# نهاية المرجع

يغطي هذا الملف الـSyntax الأساسية المستخدمة تقريبًا في دروس:

```text
20 → 74
```

من:

```text
Arithmetic Operators
```

حتى:

```text
reduce()
```
