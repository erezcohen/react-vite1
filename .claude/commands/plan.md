---
description: Create a detailed plan for a given research / issue / task
argument-hint: [research / issue / task]
---

## Task

Create a detailed plan for the research or issue or task defined in $ARGUMENTS. Think hardest.

Follow the instructions in dev/instructions/figma-to-react.md

Write a short overview of what you are planning to do.
In the first section add the reference you have received in $ARGUMENTS.
Identify files that need to be changed and explain shortly what needs to be changed.

Write a list of the unit tests and e2e tests you plan to add and edit.
Include in the list just the name of tests and whether they are new or should be edited.

Add a section that describes what are the steps that should be taken incrementally in order to achieve this.
I would like to break the plan into steps so that I will be able to follow up on the changes and avoid huge PR's. Wherever there's a need for a specific implementation in the steps please make sure it is divided into two different steps: one for the tests and the other for the implementation.
For new tests just add the name of the test that should be implemented. For existing test, just mention what tests
need to be changed and briefly describe how.

Once I approve the plan, write it to a file with the same name under dev/plans/.
Do not implement it yet.
