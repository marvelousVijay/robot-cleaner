# Robot cleaner
The Robot cleaner, once given some instructions will run on its own without human interderence and reports the unique places cleaned.

### Input Criteria: ###

- First input: number of commands the robot should execute before done. n (0 <= n <= 10000).

- Second input: Starting coordinates xy of the robot, where x (-100,000 <= x <= 100,000) and y (-100,000 <= x <= 100,000).

- Third, and any subsequent inputs: [direction + distance] where directions is uppercase character {E,W,S,N} and distance is no of steps s (0 < s < 100,000). Eg: 'E 10'

### Output Criteria: ###
Displays the unique places cleaned. Eg: "=> Cleaned: 4"

### Sample input: ###

2
10 12
E 5
N 1

### Sample output: ###
=> Cleaned: 7