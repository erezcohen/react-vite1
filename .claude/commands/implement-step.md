---
description: Implemnent a step in a feature according to a given plan
argument-hint: [plan] [step]
---

## context

Parse $ARGUMENTS to set the following values:

- [plan]: extract name of file from $1
- [step]: $2

If step number is missing pick the next number after the last one documented in dev/implementations/[name]. If no such file exists assume [step] = 1.

## Task

Implement the step number [step] as defined in [plan], and nothing else. Think hard.
Follow closely the instructions in @dev/instructions/figma-to-react.md (note that not all there may be relevant to the current step).

On completion add an entry to the file dev/implementations/[name] (create the file if it does not exist) staing the number of the step implemented and a brief summary of what was done.
