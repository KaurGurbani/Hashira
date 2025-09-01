# Hashira Placement Assignment
This repository contains my solution for the Hashira Placement Assignment.
The task was to decode roots provided in mixed-base JSON format, construct a polynomial, and compute the constant term c.

# Problem Statement (Summary)
Input is provided as a JSON file containing:
n: total number of roots.
k: minimum number of roots required (k = m + 1, where m is polynomial degree).
Each root is given with a base and a value.
Steps:
Convert each root’s value from its base to decimal.
Use first k points to construct a polynomial of degree k-1.
Solve the system of equations to find polynomial coefficients.
Output the constant term (c).

# Repository Structure
.
├── hashira_solver.js   # Main solution file (JavaScript, Node.js)
├── sample.json         # Sample test case (from assignment)
├── second.json         # Second test case (from assignment)
└── README.md           # Documentation
└── Output              # output of both test cases

# How to Run
# Prerequisites
Install Node.js (LTS recommended):
https://nodejs.org
# Run the Code
node hashira_solver.js sample.json second.json
# Expected Output
sample.json: c = 3
second.json: c = -6290016743746469796

# Test Cases
Sample Test Case

{
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2", "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4", "value": "213" }
}
Output:
c = 3

# Second Test Case

{
  "keys": { "n": 10, "k": 7 },
  "1": { "base": "6", "value": "13444211440455345511" },
  "2": { "base": "15", "value": "aed7015a346d635" },
  "3": { "base": "15", "value": "6aeeb69631c227c" },
  "4": { "base": "16", "value": "e1b5e05623d881f" },
  "5": { "base": "8", "value": "316034514573652620673" },
  "6": { "base": "3", "value": "2122212201122002221120200210011020220200" },
  "7": { "base": "3", "value": "20120221122211000100210021102001201112121" },
  "8": { "base": "6", "value": "20220554335330240002224253" },
  "9": { "base": "12", "value": "45153788322a1255483" },
  "10": { "base": "7", "value": "1101613130313526312514143" }
}

Output:
c = -6290016743746469796









