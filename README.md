# test-utils
Opinionated testing tools.

This is something extracted from a raw test script I used elsewhere. Some things it embraces:

  - Everything should be a node script. Straightforward debugging. No launch wrapper. No
    screwing CLI tool. Create your script, include me, GG.

  - Object comparing + easy and pretty diffing using `deep-diff`. Quickly exclude noise (properties
    I don't want to compare). Handle arrays. Fuck those 30 lines stack traces.

Some of options and thingies from the original script were copied and pasted and their behaviors not tested.