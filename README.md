# think_robin
WeightedRound-Robin

# Usage

```
const weightedRoundRobin = new robin();

weightedRoundRobin.add({"source": "aa", "weight": 1});
weightedRoundRobin.add({"source": "bb", "weight": 2});
weightedRoundRobin.add({"source": "cc", "weight": 3});
weightedRoundRobin.add({"source": "dd", "weight": 4});

console.log(weightedRoundRobin.get().source);
```