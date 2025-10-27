---
description: Implemnent multiple steps in a feature according to a given plan
argument-hint: [plan] [from_step] [to_step]
---

## context

Parse $ARGUMENTS to set the following values:

- [name]: extract name of file from $1, include the .md suffix.
- [from_step]: $2. If only one argument was given then set to [from_step] the next number after the last one documented in dev/implementations/[name]. If no such file exists assume [from_step] = 1.
- [to_step]: $3. If only one or two arguments were given then set to [to_step] the value of [from_step] + 1.

## Task

Implement steps starting from [from_step] to [to_step] from the plan defined in $1.
Think hard. Do not implement anything else.
Follow closely the instructions in @dev/instructions/figma-to-react.md (note that not all there may be relevant to the current step).

On completion add an entry to the file dev/implementations/[name] (create the file if it does not exist) staing the number of the step implemented and a brief summary of what was done.
