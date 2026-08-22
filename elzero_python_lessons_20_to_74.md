# Elzero Mastering Python — Lessons 20 to 74

> **ملاحظة:** الأكواد هنا هي نفس النسخ التدريبية المكافئة التي تم إرسالها في الشات، وليست نسخًا حرفيًا من كود موقع Elzero.

---

# 020 — Arithmetic Operators

```python
# Addition
print(10 + 20)
print(-10 + 30)
print(2.5 + 1.5)

# Subtraction
print(50 - 20)
print(-20 - 10)
print(-20 - -10)

# Multiplication
print(10 * 5)
print(5 + 10 * 20)
print((5 + 10) * 20)

# Division
print(100 / 20)
print(int(100 / 20))

# Modulus
print(8 % 2)
print(9 % 2)
print(22 % 5)

# Exponent
print(2 ** 5)
print(5 ** 3)

# Floor Division
print(100 // 20)
print(119 // 20)
print(142 // 20)
```

المعاملات المهمة:

```text
+  -  *  /  %  **  //
```

---

# 021 — Lists

```python
my_list = ["Python", "HTML", "Python", 10, 50.5, True]

print(my_list)

# Index
print(my_list[1])
print(my_list[-1])
print(my_list[-3])

# Slicing
print(my_list[1:4])
print(my_list[:4])
print(my_list[1:])

# Step
print(my_list[::1])
print(my_list[::2])

# Change Items
my_list[1] = "CSS"
my_list[-1] = False

print(my_list)

# Replace Slice
my_list[0:2] = ["JavaScript", "PHP"]

print(my_list)
```

الـList:
- Ordered
- Mutable
- تدعم Indexing وSlicing

---

# 022 — Lists Methods Part 1

```python
friends = ["Ahmed", "Mohamed", "Ali"]
old_friends = ["Hassan", "Omar", "Khaled"]

# append()
friends.append("Mahmoud")
friends.append(100)
friends.append(old_friends)

print(friends)
print(friends[-1])
print(friends[-1][1])

# extend()
numbers = [1, 2, 3]
letters = ["A", "B", "C"]

numbers.extend(letters)

print(numbers)

# remove()
names = ["Ahmed", "Ali", "Ahmed", "Omar"]

names.remove("Ahmed")

print(names)

# sort()
nums = [10, 5, 100, -5, 20]

nums.sort()
print(nums)

nums.sort(reverse=True)
print(nums)

# reverse()
items = [10, 1, "Python", True]

items.reverse()

print(items)
```

الـMethods:

```text
append()
extend()
remove()
sort()
reverse()
```

---

# 023 — Lists Methods Part 2

```python
# clear()
numbers = [1, 2, 3, 4]

numbers.clear()

print(numbers)


# copy()
original = [1, 2, 3, 4]

copied = original.copy()

original.append(5)

print(original)
print(copied)


# count()
numbers = [1, 2, 1, 3, 1, 5]

print(numbers.count(1))


# index()
names = ["Ahmed", "Ali", "Omar", "Khaled"]

print(names.index("Omar"))


# insert()
items = [1, 2, 3, 4]

items.insert(0, "Start")
items.insert(-1, "Test")

print(items)


# pop()
items = ["A", "B", "C", "D"]

deleted_item = items.pop(2)

print(deleted_item)
print(items)
```

الـMethods:

```text
clear()
copy()
count()
index()
insert()
pop()
```

---

# 024 — Tuples And Methods Part 1

```python
tuple_one = ("Ahmed", "Mohamed")

tuple_two = "Ahmed", "Mohamed"

print(tuple_one)
print(tuple_two)

print(type(tuple_one))
print(type(tuple_two))


numbers = (1, 2, 3, 4, 5)

print(numbers[0])
print(numbers[-1])
print(numbers[-3])


mixed = ("Python", "Python", 1, 20.5, True)

print(mixed[1])
print(mixed[-1])
```

الـTuple **Immutable**:

```python
numbers = (1, 2, 3)

# numbers[1] = 100
```

هيطلع `TypeError`.

---

# 025 — Tuples And Methods Part 2

```python
# Tuple With One Item

tuple_one = ("Python",)
tuple_two = "Python",

print(tuple_one)
print(tuple_two)

print(type(tuple_one))
print(type(tuple_two))

print(len(tuple_one))


# Concatenation

a = (1, 2, 3)
b = (4, 5)

c = a + b

print(c)


# Repeat

my_string = "Python "
my_list = [1, 2]
my_tuple = ("A", "B")

print(my_string * 3)
print(my_list * 3)
print(my_tuple * 3)


# count()

numbers = (1, 3, 7, 8, 2, 8, 8)

print(numbers.count(8))


# index()

numbers = (10, 20, 30, 40)

print(numbers.index(30))


# Tuple Destructuring

person = ("Ahmed", 25, "Egypt")

name, age, country = person

print(name)
print(age)
print(country)
```

تجاهل قيمة:

```python
person = ("Ahmed", 25, "Egypt")

name, _, country = person

print(name)
print(country)
```

---

# 026 — Set

```python
my_set = {"Ahmed", "Mohamed", "Ali"}

print(my_set)

# Set Is Not Indexed

# print(my_set[0])


# Unique Items

numbers = {1, 2, 3, 1, 2, 3}

print(numbers)


# Immutable Items Are Allowed

data = {
    10,
    "Python",
    (1, 2, 3)
}

print(data)
```

الـSet:
- غير مرتبة
- لا تدعم Indexing أو Slicing
- العناصر غير مكررة

---

# 027 — Set Methods Part 1

```python
# clear()

a = {1, 2, 3}

a.clear()

print(a)


# union()

a = {1, 2, 3}
b = {4, 5, 6}
c = {"A", "B"}

print(a | b)

print(a.union(b, c))


# add()

numbers = {1, 2, 3}

numbers.add(4)

print(numbers)


# copy()

a = {1, 2, 3}

b = a.copy()

print(b)


# remove()

numbers = {1, 2, 3, 4}

numbers.remove(2)

print(numbers)

# numbers.remove(100)
# Error


# discard()

numbers = {1, 2, 3, 4}

numbers.discard(2)
numbers.discard(100)

print(numbers)


# pop()

numbers = {1, 2, 3, 4}

print(numbers.pop())


# update()

a = {1, 2, 3}

a.update([4, 5])
a.update({"A", "B"})

print(a)
```

الفرق:

```text
remove()  -> Error لو العنصر غير موجود
discard() -> لا يعمل Error
```

---

# 028 — Set Methods Part 2

```python
# difference()

a = {1, 2, 3, 4}
b = {1, 2, "Ahmed"}

print(a.difference(b))

print(a - b)


# difference_update()

a = {1, 2, 3, 4}
b = {1, 2}

a.difference_update(b)

print(a)


# intersection()

a = {1, 2, 3, 4, "Python"}
b = {2, 3, "Python"}

print(a.intersection(b))

print(a & b)


# intersection_update()

a = {1, 2, 3, 4}
b = {2, 3}

a.intersection_update(b)

print(a)


# symmetric_difference()

a = {1, 2, 3, 4}
b = {1, 2, 5, 6}

print(a.symmetric_difference(b))

print(a ^ b)


# symmetric_difference_update()

a = {1, 2, 3, 4}
b = {1, 2, 5, 6}

a.symmetric_difference_update(b)

print(a)
```

---

# 029 — Set Methods Part 3

```python
# issuperset()

a = {1, 2, 3, 4}
b = {1, 2}

print(a.issuperset(b))
print(b.issuperset(a))


# issubset()

a = {1, 2, 3, 4}
b = {1, 2}

print(b.issubset(a))
print(a.issubset(b))


# isdisjoint()

a = {1, 2, 3}
b = {4, 5, 6}
c = {2, 10, 20}

print(a.isdisjoint(b))
print(a.isdisjoint(c))
```

احفظ:

```text
issuperset()
issubset()
isdisjoint()
```

---

# 030 — Dictionary

```python
user = {
    "name": "Ahmed",
    "age": 25,
    "country": "Egypt",
    "skills": ["Python", "HTML", "CSS"],
    "rating": 9.5
}

print(user)

print(user["name"])
print(user["country"])

print(user.get("name"))
print(user.get("country"))

print(user.keys())
print(user.values())
```

Dictionary داخل Dictionary:

```python
languages = {
    "one": {
        "name": "Python",
        "progress": "80%"
    },

    "two": {
        "name": "HTML",
        "progress": "90%"
    },

    "three": {
        "name": "CSS",
        "progress": "70%"
    }
}

print(languages)

print(languages["one"])

print(languages["one"]["name"])

print(languages["two"]["progress"])
```

```python
print(len(user))
print(len(languages))

print(len(languages["one"]))
```

---

# 031 — Dictionary Methods Part 1

```python
user = {
    "name": "Ahmed",
    "age": 25
}

# clear()
test = user.copy()
test.clear()
print(test)

# update()
user.update({"country": "Egypt"})
print(user)

# Add item directly
user["skill"] = "Python"
print(user)

# copy()
copied_user = user.copy()
print(copied_user)

# keys()
print(user.keys())

# values()
print(user.values())
```

---

# 032 — Dictionary Methods Part 2

```python
user = {
    "name": "Ahmed",
    "age": 25
}

# setdefault()
print(user.setdefault("name", "Mohamed"))

user.setdefault("country", "Egypt")

print(user)


# popitem()
user["skill"] = "Python"

print(user.popitem())
print(user)


# items()
print(user.items())


# fromkeys()
keys = ("name", "age", "country")
default_value = "Unknown"

new_dictionary = dict.fromkeys(keys, default_value)

print(new_dictionary)
```

---

# 033 — Boolean

```python
print(10 > 5)
print(10 < 5)

print("=" * 30)

# True Values
print(bool("Python"))
print(bool(100))
print(bool(15.5))
print(bool([1, 2, 3]))
print(bool(True))

print("=" * 30)

# False Values
print(bool(0))
print(bool(""))
print(bool([]))
print(bool(()))
print(bool({}))
print(bool(False))
print(bool(None))
```

خلي بالك:

```python
bool(" ")
```

`True` لأن فيه مسافة.

لكن:

```python
bool("")
```

`False`.

---

# 034 — Boolean Operators

```python
age = 25
country = "Egypt"
level = 8

# and
print(age >= 18 and country == "Egypt")
print(age >= 18 and country == "USA")


# or
print(age > 30 or country == "Egypt")
print(age > 30 or country == "USA")


# not
print(age > 18)

print(not age > 18)
```

القواعد:

```text
and -> كل الشروط True
or  -> يكفي شرط واحد True
not -> يعكس النتيجة
```

---

# 035 — Assignment Operators

```python
x = 10

x += 5
print(x)

x -= 3
print(x)

x *= 2
print(x)

x /= 4
print(x)

x %= 4
print(x)
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

# 036 — Comparison Operators

```python
a = 20
b = 10

# Equal
print(a == b)

# Not Equal
print(a != b)

# Greater Than
print(a > b)

# Less Than
print(a < b)

# Greater Than Or Equal
print(a >= 20)

# Less Than Or Equal
print(b <= 10)
```

الفرق:

```text
=  -> Assignment
== -> Comparison
```

---

# 037 — Type Conversion

```python
age = 25

print(type(age))

age = str(age)

print(type(age))
print(age)
```

```python
number = "100"

number = int(number)

print(number)
print(type(number))
```

```python
number = "10.5"

number = float(number)

print(number)
print(type(number))
```

```python
name = "Python"

print(list(name))
```

```python
numbers = [1, 2, 3]

print(tuple(numbers))
```

```python
numbers = [1, 1, 2, 2, 3]

print(set(numbers))
```

---

# 038 — User Input

```python
name = input("What's Your Name? ")

print(name)
```

```python
name = input("What's Your Name? ")

name = name.strip().capitalize()

print(f"Hello {name}")
```

`input()` بيرجع String دائمًا:

```python
age = input("Enter Your Age: ")

print(type(age))
```

لو محتاج Integer:

```python
age = int(input("Enter Your Age: "))

print(age)
print(type(age))
```

---

# 039 — Practical Email Slice

```python
email = input("Enter Your Email: ").strip().lower()

username = email[:email.index("@")]

website = email[email.index("@") + 1:email.index(".")]

domain = email[email.index(".") + 1:]

print(f"Username: {username}")
print(f"Website: {website}")
print(f"Domain: {domain}")
```

لو:

```text
ahmed@gmail.com
```

الناتج:

```text
Username: ahmed
Website: gmail
Domain: com
```

---

# 040 — Practical Your Age In Full Details

```python
age = int(input("Enter Your Age: "))

months = age * 12
weeks = months * 4
days = age * 365
hours = days * 24
minutes = hours * 60
seconds = minutes * 60

print(f"You Lived For {months} Months")
print(f"You Lived For {weeks} Weeks")
print(f"You Lived For {days} Days")
print(f"You Lived For {hours} Hours")
print(f"You Lived For {minutes} Minutes")
print(f"You Lived For {seconds} Seconds")
```

---

# 041 — Control Flow: If, Elif, Else

```python
name = "Ahmed"
country = "Egypt"
price = 100

if country == "Egypt":
    print(f"Hello {name}")
    print(f"The Price Is {price - 20}")

elif country == "KSA":
    print(f"Hello {name}")
    print(f"The Price Is {price - 10}")

else:
    print(f"Hello {name}")
    print(f"The Price Is {price}")
```

الشكل العام:

```python
if condition:
    # Code

elif another_condition:
    # Code

else:
    # Code
```

الـIndentation مهمة جدًا.

---

# 042 — Nested If + Trainings

```python
name = "Ahmed"
country = "Egypt"
student = True
price = 100

if country == "Egypt":

    if student:
        print(f"Hello {name}")
        print(f"Your Price Is {price - 30}")

    else:
        print(f"Hello {name}")
        print(f"Your Price Is {price - 20}")

else:
    print(f"Hello {name}")
    print(f"Your Price Is {price}")
```

```python
age = 25
has_license = True

if age >= 18:

    if has_license:
        print("You Can Drive")

    else:
        print("You Need A License")

else:
    print("You Are Too Young")
```

---

# 043 — Ternary Conditional Operator

```python
age = 20

if age >= 18:
    print("Allowed")
else:
    print("Not Allowed")
```

اختصار:

```python
age = 20

print("Allowed" if age >= 18 else "Not Allowed")
```

```python
age = 17

message = "Adult" if age >= 18 else "Not Adult"

print(message)
```

الصيغة:

```python
value_if_true if condition else value_if_false
```

---

# 044 — Calculate Age Advanced Version

```python
age = int(input("Enter Your Age: ").strip())

if age > 10 and age < 100:

    months = age * 12
    weeks = age * 52
    days = age * 365
    hours = days * 24
    minutes = hours * 60
    seconds = minutes * 60

    print(f"You Lived {months} Months")
    print(f"You Lived {weeks} Weeks")
    print(f"You Lived {days} Days")
    print(f"You Lived {hours} Hours")
    print(f"You Lived {minutes} Minutes")
    print(f"You Lived {seconds} Seconds")

else:
    print("Age Is Out Of Range")
```

---

# 045 — Membership Operators

```python
name = "Ahmed"

friends = ["Ahmed", "Mohamed", "Ali"]

print(name in friends)
```

```python
name = "Omar"

friends = ["Ahmed", "Mohamed", "Ali"]

print(name not in friends)
```

مع String:

```python
word = "Python"

print("P" in word)
print("z" in word)
```

مع Dictionary:

```python
user = {
    "name": "Ahmed",
    "age": 25
}

print("name" in user)
print("country" in user)
```

---

# 046 — Practical Membership Control

```python
admins = ["Ahmed", "Mohamed", "Ali"]

name = input("Enter Your Name: ").strip().capitalize()

if name in admins:

    print(f"Welcome Admin {name}")

else:

    print(f"Sorry {name}, You Are Not Admin")
```

تطبيق أوسع:

```python
admins = ["Ahmed", "Mohamed", "Ali"]

name = input("Enter Your Name: ").strip().capitalize()

if name in admins:

    print(f"Welcome Back {name}")

    option = input("Delete Or Update Your Name? ").strip().lower()

    if option == "update":

        new_name = input("Enter New Name: ").strip().capitalize()

        admins[admins.index(name)] = new_name

        print("Name Updated")
        print(admins)

    elif option == "delete":

        admins.remove(name)

        print("Name Deleted")
        print(admins)

else:

    print("You Are Not Admin")
```

---

# 047 — While Loop And Else

```python
a = 0

while a < 5:

    print(a)

    a += 1
```

While + Else:

```python
a = 0

while a < 5:

    print(a)

    a += 1

else:

    print("Loop Is Done")
```

خلي بالك من الـInfinite Loop لو نسيت تحديث المتغير.

---

# 048 — While Trainings

```python
websites = [
    "Google",
    "Facebook",
    "YouTube",
    "Instagram"
]

a = 0

while a < len(websites):

    print(websites[a])

    a += 1
```

```python
friends = ["Ahmed", "Ali", "Omar", "Hassan"]

index = 0

while index < len(friends):

    print(f"#{index + 1} {friends[index]}")

    index += 1
```

---

# 049 — Bookmark Manager

```python
bookmarks = []

maximum_bookmarks = 5

while maximum_bookmarks > 0:

    website = input("Enter Website Without https://: ").strip().lower()

    bookmarks.append(f"https://{website}")

    maximum_bookmarks -= 1

    print(f"Website Added, {maximum_bookmarks} Places Left")

else:

    print("Bookmarks List Is Full")
```

عرض المواقع:

```python
index = 0

while index < len(bookmarks):

    print(bookmarks[index])

    index += 1
```

---

# 050 — Password Guess

```python
password = "python123"

tries = 4

input_password = input("Enter Password: ")

while input_password != password:

    tries -= 1

    print(f"Wrong Password, {tries} Tries Left")

    input_password = input("Enter Password Again: ")

    if tries == 0:

        print("All Tries Finished")

        break

else:

    print("Correct Password")
```

نسخة أبسط:

```python
password = "1234"

guess = input("Enter Password: ")

while guess != password:

    print("Wrong Password")

    guess = input("Try Again: ")

print("Correct Password")
```

---

# 051 — For Loop And Else

```python
numbers = [1, 2, 3, 4, 5]

for number in numbers:
    print(number)
```

مع String:

```python
name = "Python"

for letter in name:
    print(letter)
```

مع Else:

```python
numbers = [1, 2, 3, 4]

for number in numbers:
    print(number)

else:
    print("Loop Finished")
```

---

# 052 — For Loop Trainings

```python
numbers = [1, 2, 3, 4, 5, 6]

for number in numbers:

    if number % 2 == 0:
        print(f"{number} Is Even")

    else:
        print(f"{number} Is Odd")
```

```python
friends = ["Ahmed", "Mohamed", "Ali", "Omar"]

for friend in friends:

    print(f"Hello {friend}")
```

```python
numbers = [10, 15, 20, 25, 30]

for number in numbers:

    if number % 5 == 0:
        print(number)

else:
    print("Loop Finished Successfully")
```

---

# 053 — Nested For Loop

```python
people = ["Ahmed", "Mohamed", "Ali"]

skills = ["HTML", "CSS", "Python"]

for person in people:

    print(f"{person} Skills:")

    for skill in skills:
        print(f"- {skill}")
```

```python
students = [
    ["Ahmed", 90],
    ["Ali", 80],
    ["Omar", 70]
]

for student in students:

    for data in student:
        print(data)
```

---

# 054 — Break, Continue, Pass

## break

```python
numbers = [1, 2, 3, 4, 5, 6]

for number in numbers:

    if number == 4:
        break

    print(number)
```

## continue

```python
numbers = [1, 2, 3, 4, 5]

for number in numbers:

    if number == 3:
        continue

    print(number)
```

## pass

```python
for number in range(10):

    if number == 5:
        pass

    print(number)
```

---

# 055 — Loop Advanced Dictionary

```python
user = {
    "name": "Ahmed",
    "age": 25,
    "country": "Egypt"
}
```

```python
for item in user:
    print(item)
```

```python
for key in user:

    print(user[key])
```

```python
for value in user.values():
    print(value)
```

Keys + Values:

```python
for key, value in user.items():

    print(f"{key} => {value}")
```

---

# 056 — Function And Return

```python
def say_hello():

    print("Hello")
    print("Welcome To Python")
```

تشغيل:

```python
say_hello()
```

Return:

```python
def calculate():

    result = 10 + 20

    return result


number = calculate()

print(number)
```

مثال:

```python
def get_number():

    return 100


number = get_number()

print(number * 2)
```

---

# 057 — Function Parameters And Arguments

```python
def say_hello(name):

    print(f"Hello {name}")
```

```python
say_hello("Ahmed")
say_hello("Ali")
say_hello("Omar")
```

أكثر من Parameter:

```python
def user_info(name, age, country):

    print(f"Name: {name}")
    print(f"Age: {age}")
    print(f"Country: {country}")
```

```python
user_info("Ahmed", 25, "Egypt")
```

Return:

```python
def addition(num1, num2):

    return num1 + num2


result = addition(10, 20)

print(result)
```

- `num1`, `num2` = Parameters
- `10`, `20` = Arguments

---

# 058 — Packing & Unpacking Arguments

```python
def say_hello(*names):

    print(names)
```

```python
say_hello("Ahmed", "Ali", "Omar")
```

Loop:

```python
def say_hello(*names):

    for name in names:

        print(f"Hello {name}")
```

Unpacking:

```python
skills = ["Python", "HTML", "CSS"]
```

```python
def show_skills(skill1, skill2, skill3):

    print(skill1)
    print(skill2)
    print(skill3)
```

```python
show_skills(*skills)
```

---

# 059 — Function Default Parameters

```python
def say_hello(name="Unknown"):

    print(f"Hello {name}")
```

```python
say_hello("Ahmed")
say_hello()
```

مثال:

```python
def user_info(name, age="Unknown", country="Egypt"):

    print(f"Name: {name}")
    print(f"Age: {age}")
    print(f"Country: {country}")
```

```python
user_info("Ahmed")
user_info("Ahmed", 25)
```

الـParameters بدون Default تيجي قبل اللي لها Default.

---

# 060 — Packing & Unpacking Keyword Arguments

```python
def show_skills(**skills):

    print(skills)
```

```python
show_skills(
    Python="90%",
    HTML="80%",
    CSS="75%"
)
```

Loop:

```python
def show_skills(**skills):

    for skill, progress in skills.items():

        print(f"{skill} => {progress}")
```

Unpacking Dictionary:

```python
my_skills = {
    "Python": "90%",
    "HTML": "80%",
    "CSS": "75%"
}
```

```python
show_skills(**my_skills)
```

الفرق:

```text
*args   -> Tuple
**kwargs -> Dictionary
```

---

# 061 — Packing & Unpacking Arguments Trainings

```python
def show_skills(name, *skills, **skills_progress):

    print(f"Hello {name}")

    print("Skills Without Progress:")

    for skill in skills:
        print(f"- {skill}")

    print("Skills With Progress:")

    for skill, progress in skills_progress.items():
        print(f"- {skill} => {progress}")


show_skills(
    "Ahmed",
    "HTML",
    "CSS",
    Python="90%",
    JavaScript="80%"
)
```

مع بيانات جاهزة:

```python
my_skills = ("HTML", "CSS", "Git")

my_progress = {
    "Python": "90%",
    "JavaScript": "80%"
}


def show_data(name, *skills, **progress):

    print(f"Hello {name}")

    for skill in skills:
        print(skill)

    for skill, value in progress.items():
        print(f"{skill} => {value}")


show_data(
    "Ahmed",
    *my_skills,
    **my_progress
)
```

---

# 062 — Function Scope

```python
x = 100


def test():

    x = 50

    print(f"Inside Function: {x}")


test()

print(f"Outside Function: {x}")
```

`x = 50` Local، و`x = 100` Global.

استخدام `global`:

```python
x = 100


def change_number():

    global x

    x = 500

    print(x)


change_number()

print(x)
```

---

# 063 — Function Recursion

```python
def countdown(number):

    if number == 0:
        print("Done")
        return

    print(number)

    countdown(number - 1)


countdown(5)
```

مثال إزالة الحروف المكررة:

```python
def clean_word(word):

    if len(word) == 1:
        return word

    if word[0] == word[1]:

        return clean_word(word[1:])

    return word[0] + clean_word(word[1:])


print(clean_word("wwwooorrrlllddd"))
```

---

# 064 — Lambda Function

```python
def say_hello(name):

    return f"Hello {name}"
```

Lambda:

```python
say_hello = lambda name: f"Hello {name}"

print(say_hello("Ahmed"))
```

جمع:

```python
addition = lambda num1, num2: num1 + num2

print(addition(10, 20))
```

الصيغة:

```python
lambda arguments: expression
```

---

# 065 — Files Handling Part 1 — Intro

```python
my_file = open("data.txt")
```

```python
my_file = open("data.txt", "r")
```

أشهر Modes:

```text
r = Read
w = Write
a = Append
x = Create
```

مثال:

```python
file = open("test.txt", "w")
```

---

# 066 — Files Handling Part 2 — Read Files

```python
file = open("data.txt", "r")

print(file.read())
```

عدد Characters:

```python
file = open("data.txt", "r")

print(file.read(5))
```

`readline()`:

```python
file = open("data.txt", "r")

print(file.readline())
```

```python
print(file.readline())
print(file.readline())
```

`readlines()`:

```python
file = open("data.txt", "r")

print(file.readlines())
```

Loop:

```python
file = open("data.txt", "r")

for line in file:

    print(line.strip())
```

إغلاق:

```python
file.close()
```

---

# 067 — Files Handling Part 3 — Write And Append

Write:

```python
file = open("data.txt", "w")

file.write("Hello Python")

file.close()
```

```python
file = open("names.txt", "w")

file.write("Ahmed\n")
file.write("Ali\n")
file.write("Omar\n")

file.close()
```

`writelines()`:

```python
names = [
    "Ahmed\n",
    "Ali\n",
    "Omar\n"
]

file = open("names.txt", "w")

file.writelines(names)

file.close()
```

Append:

```python
file = open("names.txt", "a")

file.write("Mohamed\n")

file.close()
```

الفرق:

```text
w -> يمسح القديم ويكتب
a -> يضيف على القديم
```

---

# 068 — Files Handling Part 4 — Important Information

`tell()`:

```python
file = open("data.txt", "r")

print(file.tell())
```

`seek()`:

```python
file = open("data.txt", "r")

file.seek(5)

print(file.read())
```

`truncate()`:

```python
file = open("data.txt", "a")

file.truncate(10)

file.close()
```

حذف ملف:

```python
import os

os.remove("data.txt")
```

---

# 069 — Built In Functions Part 1

`all()`:

```python
numbers = [1, 2, 3, 4]

print(all(numbers))
```

```python
numbers = [1, 2, 0, 4]

print(all(numbers))
```

`any()`:

```python
numbers = [0, False, "", 10]

print(any(numbers))
```

الفرق:

```text
all() -> كلهم لازم True
any() -> واحد فقط يكفي
```

`bin()`:

```python
print(bin(10))
```

`id()`:

```python
x = 100

print(id(x))
```

---

# 070 — Built In Functions Part 2

`sum()`:

```python
numbers = [10, 20, 30]

print(sum(numbers))
```

```python
print(sum(numbers, 100))
```

`round()`:

```python
print(round(10.7))
print(round(10.3))
```

```python
print(round(10.56789, 2))
```

`range()`:

```python
print(list(range(10)))
```

```python
print(list(range(1, 10)))
```

```python
print(list(range(0, 20, 2)))
```

`print()` Advanced:

```python
print("Ahmed", "Ali", "Omar", sep=" | ")
```

```python
print("Hello", end=" ")
print("Python")
```

---

# 071 — Built In Functions Part 3

`abs()`:

```python
print(abs(-100))
```

`pow()`:

```python
print(pow(2, 5))
```

`min()`:

```python
numbers = [10, 30, 5, 100]

print(min(numbers))
```

`max()`:

```python
print(max(numbers))
```

مع Strings:

```python
print(min("Ahmed", "Mohamed", "Ali"))
print(max("Ahmed", "Mohamed", "Ali"))
```

`slice()`:

```python
name = "Programming"

print(name[0:5])
```

```python
my_slice = slice(0, 5)

print(name[my_slice])
```

---

# 072 — Built In Functions Part 4 — Map

```python
numbers = [1, 2, 3, 4]
```

```python
def double_number(number):

    return number * 2
```

```python
result = map(double_number, numbers)

print(list(result))
```

Map + Lambda:

```python
numbers = [1, 2, 3, 4]

result = map(lambda number: number * 2, numbers)

print(list(result))
```

الفكرة:

```python
map(function, iterable)
```

---

# 073 — Built In Functions Part 5 — Filter

```python
numbers = [1, 2, 3, 4, 5, 6]
```

```python
def even_number(number):

    return number % 2 == 0
```

```python
result = filter(even_number, numbers)

print(list(result))
```

Filter + Lambda:

```python
numbers = [1, 2, 3, 4, 5, 6]

result = filter(
    lambda number: number % 2 == 0,
    numbers
)

print(list(result))
```

أسماء:

```python
names = [
    "Ahmed",
    "Ali",
    "Omar",
    "Mohamed"
]

result = filter(
    lambda name: name.startswith("A"),
    names
)

print(list(result))
```

الفرق:

```text
map    -> يعدل العناصر
filter -> يختار عناصر
```

---

# 074 — Built In Functions Part 6 — Reduce

```python
from functools import reduce
```

```python
numbers = [1, 2, 3, 4]
```

```python
def add_numbers(num1, num2):

    return num1 + num2
```

```python
result = reduce(add_numbers, numbers)

print(result)
```

العملية:

```text
1 + 2 = 3
3 + 3 = 6
6 + 4 = 10
```

Reduce + Lambda:

```python
from functools import reduce

numbers = [10, 20, 30, 40]

result = reduce(
    lambda num1, num2: num1 + num2,
    numbers
)

print(result)
```

---

# الفرق بين Map / Filter / Reduce

| Function | وظيفتها |
|---|---|
| `map()` | تعدّل كل عنصر |
| `filter()` | تختار بعض العناصر |
| `reduce()` | تحوّل العناصر كلها لقيمة واحدة |

```python
numbers = [1, 2, 3, 4, 5]
```

Map:

```python
list(map(lambda x: x * 2, numbers))
```

Filter:

```python
list(filter(lambda x: x > 2, numbers))
```

Reduce:

```python
from functools import reduce

reduce(lambda x, y: x + y, numbers)
```

---

# ملخص أهم ما تم تغطيته من 20 إلى 74

## Operators

```text
+ - * / % ** //
== != > < >= <=
and or not
in not in
+= -= *= /= %=
```

## Data Types

```text
List
Tuple
Set
Dictionary
Boolean
```

## Input / Conversion

```python
input()
str()
int()
float()
list()
tuple()
set()
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
global
lambda
recursion
```

## File Handling

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

## Built-In / Functional

```python
all()
any()
bin()
id()
sum()
round()
range()
print()
abs()
pow()
min()
max()
slice()
map()
filter()
reduce()
```
