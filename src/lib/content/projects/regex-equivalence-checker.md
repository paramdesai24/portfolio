---
title: "Regex Equivalence Checker"
shortDescription: "Compare two formal regular expressions and get a shortest counterexample when they differ."
techStack: []
researchThemes: ["Formal Languages", "Automata", "Graph Search"]
status: "active"
featured: false
order: 6
---

## Overview

Two regular expressions can look different while accepting the same strings. I built a checker that decides whether they describe the same language and explains a difference with a concrete example.

## Approach

The checker converts each expression into an epsilon-NFA, determinizes it, and applies Hopcroft minimization. It searches the product automaton for a state where exactly one expression accepts. Breadth-first search finds a shortest distinguishing string when one exists.

## Example

For `a*` and `aa*`, the empty string is a shortest counterexample. The first expression accepts it, while the second requires at least one `a`. The checker works with formal-language regular expressions.
