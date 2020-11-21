#!/usr/bin/python

from random import randint

print("Content-type:text/html\r\n\r\n")

def thisorthat():
    ra = randint(1,100)
    if ra > 50:
        return "hey nom!"
    else:
        return "hey witch!"

print(thisorthat())