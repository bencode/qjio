alias:: Transducer: A powerful function composition pattern
notebook:: [Transducer: 一种强大的函数组合模式](https://www.qijun.io/notebooks/index.html?path=transducers.ipynb)

- ## map & filter
  collapsed:: true
	- The semantics of map is "mapping," which means performing a transformation on all elements in a set once.
	- ```typescript
	  const list = [1, 2, 3, 4, 5]
	  
	  list.map(x => x + 1)
	  // [ 2, 3, 4, 5, 6 ]
	  ```
	- ```typescript
	  function map(f, xs) {
	    const ret = []
	    for (let i = 0; i < xs.length; i++) {
	      ret.push(f(xs[i]))
	    }
	    return ret
	  }
	  ```
	- ```typescript
	  map(x => x + 1, [1, 2, 3, 4, 5])
	  // [ 2, 3, 4, 5, 6 ]
	  ```
	- The above intentionally uses a for statement to clearly express that the implementation of map relies on the collection type.
		- Sequential execution;
		- Immediate evaluation, not lazy.
	- Let's look at `filter`:
	- ```typescript
	  function filter(f, xs) {
	    const ret = []
	    for (let i = 0; i < xs.length; i++) {
	      if (f(xs[i])) {
	        ret.push(xs[i])
	      }
	    }
	    return ret
	  }
	  ```
	- ```typescript
	  var range = n => [...Array(n).keys()]
	  ```
	- ```typescript
	  filter(x => x % 2 === 1, range(10))
	  // [ 1, 3, 5, 7, 9 ]
	  ```
	- Similarly, the implementation of `filter` also depends on the specific collection type, and the current implementation requires `xs` to be an array.
	- How can `map` support different data types? For example, `Set` , `Map` , and custom data types.
	- There is a conventional way: it relies on the interface (protocol) of the collection.
	- Different languages have different implementations, `JS` has relatively weak native support in this regard, but it is also feasible:
		- Iterate using `Symbol.iterator` .
		- Use `Object#constractor` to obtain the constructor.
	- So how do we abstractly support different data types in `push` ?
	- Imitating the `ramdajs` library, it can rely on the custom `@@transducer/step` function.
	- ```typescript
	  function map(f, xs) {
	    const ret = new xs.constructor()  // 1. construction
	    for (const x of xs) { // 2. iteration
	      ret['@@transducer/step'](f(x))  // 3. collection
	    }
	    return ret
	  }
	  ```
	- ```typescript
	  Array.prototype['@@transducer/step'] = Array.prototype.push
	  // [Function: push]
	  ```
	- ```typescript
	  map(x => x + 1, [1, 2, 3, 4, 5])
	  // [ 2, 3, 4, 5, 6 ]
	  ```
	- ```typescript
	  Set.prototype['@@transducer/step'] = Set.prototype.add
	  // [Function: add]
	  ```
	- ```typescript
	  map(x => x + 1, new Set([1, 2, 3, 4, 5]))
	  // Set (5) {2, 3, 4, 5, 6}
	  ```
	- By using this method, we can implement functions such as `map` , `filter` , etc., which are more axial.
	- The key is to delegate operations such as construction, iteration, and collection to specific collection classes, because only the collection itself knows how to complete these operations.
	- ```typescript
	  function filter(f, xs) {
	    const ret = new xs.constructor()
	    for (const x of xs) {
	      if (f(x)) {
	        ret['@@transducer/step'](x)
	      }
	    }
	    return ret
	  }
	  ```
	- ```typescript
	  filter(x => x % 2 === 1, range(10))
	  // [ 1, 3, 5, 7, 9 ]
	  ```
	- ```typescript
	  filter(x => x > 3, new Set(range(10)))
	  // Set (6) {4, 5, 6, 7, 8, 9}
	  ```
- ## compose
  collapsed:: true
	- There will be some issues when the above `map` and `filter` are used in combination.
	- ```typescript
	  range(10)
	    .map(x => x + 1)
	    .filter(x => x % 2 === 1)
	    .slice(0, 3)
	  // [ 1, 3, 5 ]
	  ```
	- Although only 5 elements are used, all elements in the collection will be traversed.
	- Each step will generate an intermediate collection object.
	- We use `compose` to implement this logic again
	- ```typescript
	  function compose(...fns) {
	    return fns.reduceRight((acc, fn) => x => fn(acc(x)), x => x)
	  }
	  ```
	- To support composition, we implement functions like `map` and `filter` in the form of `curry` .
	- ```typescript
	  function curry(f) {
	    return (...args) => data => f(...args, data)
	  }
	  ```
	- ```typescript
	  var rmap = curry(map)
	  var rfilter = curry(filter)
	  
	  function take(n, xs) {
	    const ret = new xs.constructor()
	    for (const x of xs) {
	      if (n <= 0) {
	        break
	      }
	      n--
	      ret['@@transducer/step'](x)
	    }
	    return ret
	  }
	  var rtake = curry(take)
	  ```
	- ```typescript
	  take(3, range(10))
	  // [ 0, 1, 2 ]
	  ```
	- ```typescript
	  take(4, new Set(range(10)))
	  // Set (4) {0, 1, 2, 3}
	  ```
	- ```typescript
	  const takeFirst3Odd = compose(
	    rtake(3),
	    rfilter(x => x % 2 === 1),
	    rmap(x => x + 1)
	  )
	  
	  takeFirst3Odd(range(10))
	  // [ 1, 3, 5 ]
	  ```
	- So far, our implementation is clear and concise in expression but wasteful in runtime.
- ## The shape of the function
  collapsed:: true
	- ### Transformer
	  collapsed:: true
		- The `map` function in version `curry` is like this:
		- ```typescript
		  const map = f => xs => ...
		  ```
		- That is, `map(x => ...)` returns a single-parameter function.
		- ```typescript
		  type Transformer = (xs: T) => R
		  ```
		- Functions with a single parameter can be easily composed.
		- Specifically, the input of these functions is "data", the output is the processed data, and the function is a data transformer (Transformer).
		- ```
		  data ->> map(...) ->> filter(...) ->> reduce(...) -> result
		  ```
		- ```typescript
		  function pipe(...fns) {
		    return x => fns.reduce((ac, f) => f(ac), x)
		  }
		  ```
		- ```typescript
		  const reduce = (f, init) => xs => xs.reduce(f, init)
		  
		  const f = pipe(
		    rmap(x => x + 1),
		    rfilter(x => x % 2 === 1),
		    rtake(5),
		    reduce((a, b) => a + b, 0)
		  )
		  
		  f(range(100))
		  // 25
		  ```
		- `Transformer` is a single-parameter function, convenient for function composition.
		- ```typescript
		  type Transformer = (x: T) => T
		  ```
	- ### Reducer
	  collapsed:: true
		- A reducer is a two-parameter function that can be used to express more complex logic.
		- ```typescript
		  type Reducer = (ac: R, x: T) => R
		  ```
		- #### sum
		  collapsed:: true
			- ```typescript
			  // add is an reducer
			  const add = (a, b) => a + b
			  const sum = xs => xs.reduce(add, 0)
			  
			  sum(range(11))
			  // 55
			  ```
		- #### map
		  collapsed:: true
			- ```typescript
			  function concat(list, x) {
			    list.push(x)
			    return list
			  }
			  ```
			- ```typescript
			  const map = f => xs => xs.reduce((ac, x) => concat(ac, f(x)), [])
			  
			  map(x => x * 2)(range(10))
			  // [ 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 ]
			  ```
		- #### filter
		  collapsed:: true
			- ```typescript
			  const filter = f => xs => xs.reduce((ac, x) => f(x) ? concat(ac, x) : ac, [])
			  
			  filter(x => x > 3 && x < 10)(range(20))
			  // [ 4, 5, 6, 7, 8, 9 ]
			  ```
		- #### take
		  collapsed:: true
			- How to implement `take` ? This requires `reduce` to have functionality similar to `break` .
			- ```typescript
			  function reduced(x) {
			    return x && x['@@transducer/reduced'] ? x : { '@@transducer/reduced': true, '@@transducer/value': x }
			  }
			  
			  function reduce(f, init) {
			    return xs => {
			      let ac = init
			      for (const x of xs) {
			        const r = f(ac, x)
			        if (r && r['@@transducer/reduced']) {
			          return r['@@transducer/value']
			        }
			        ac = r
			      }
			      return ac
			    }
			  }
			  ```
			- ```typescript
			  function take(n) {
			    return xs => {
			      let i = 0
			      return reduce((ac, x) => {
			        if (i === n) {
			          return reduced(ac)
			        }
			        i++
			        return concat(ac, x)
			      }, [])(xs)
			    }
			  }
			  ```
			- ```typescript
			  take(4)(range(10))
			  // [ 0, 1, 2, 3 ]
			  ```
- ## Transducer
  collapsed:: true
	- Finally, we meet our protagonist
	- First re-examine the previous `map` implementation
	- ```typescript
	  function map(f, xs) {
	    const ret = []
	    for (let i = 0; i < xs.length; i++) {
	      ret.push(f(xs[i]))
	    }
	    return ret
	  }
	  ```
	- We need to find a way to separate the logic that depends on the array (Array) mentioned above and abstract it into a `Reducer` .
	- ```typescript
	  function rmap(f) {
	    return reducer => {
	      return (ac, x) => {
	        return reducer(ac, f(x))
	      }
	    }
	  }
	  ```
	- The construction disappeared, the iteration disappeared, and the collection of elements also disappeared.
	- Through a `reducer` , our map only contains the logic within its responsibilities.
	- Take another look at `filter`
	- ```typescript
	  function rfilter(f) {
	    return reducer => (ac, x) => {
	      return f(x) ? reducer(ac, x) : ac
	    }
	  }
	  ```
	- Notice `rfilter` and the return type of `rmap` above:
	- ```typescript
	  reducer => (acc, x) => ...
	  ```
	- It is actually a `Transfomer` , with both parameters and return values being `Reducer` , it is `Transducer` .
	- `Transformer` is composable, so `Transducer` is also composable.
	- ```typescript
	  function rtake(n) {
	    return reducer => {
	      let i = 0
	      return (ac, x) => {
	        if (i === n) {
	          return reduced(ac)
	        }
	        i++
	        return reducer(ac, x)
	      }
	    }
	  }
	  ```
- ## into & transduce
  collapsed:: true
	- However, how to use `transducer` ?
	- ```typescript
	  compose
	  // [Function: compose]
	  ```
	- ```typescript
	  var tf = compose(
	    rmap(x => x + 1),
	    rfilter(x => x % 2 === 1),
	    rtake(5)
	  )
	  tf
	  // [Function (anonymous)]
	  ```
	- We need to implement iteration and collection using a reducer.
	- ```typescript
	  const collect = (ac, x) => {
	    ac.push(x)
	    return ac
	  }
	  
	  const reducer = tf(collect)
	  reduce(reducer, [])(range(100))
	  // [ 1, 3, 5, 7, 9 ]
	  ```
	- It can work now, and we also noticed that the iteration is "on-demand". Although there are 100 elements in the collection, only the first 10 elements were iterated.
	- Next, we will encapsulate the above logic into a function.
	- ```typescript
	  const collect = (ac, x) => {
	    ac.push(x)
	    return ac
	  }
	  
	  function into(init, tf) {
	    const reducer = tf(collect)
	    return reduce(reducer, init)
	  }
	  ```
	- ```typescript
	  into([], compose(
	    rmap(x => x + 1),
	    rfilter(x => x % 2 === 1),
	    rtake(8)
	  ))  (range(100))
	  // [ 1, 3, 5, 7, 9, 11, 13, 15 ]
	  ```
- ## Flow
  collapsed:: true
	- ### Fibonacci generator.
	  collapsed:: true
		- Suppose we have some kind of asynchronous data collection, such as an asynchronous infinite Fibonacci generator.
		- ```typescript
		  function sleep(n) {
		    return new Promise(r => setTimeout(r, n))
		  }
		  
		  async function *fibs() {
		    let [a, b] = [0, 1]
		    while (true) {
		      await sleep(10)
		      yield a
		      ;[a, b] = [b, a + b]
		    }
		  }
		  ```
		- ```typescript
		  const s = fibs()
		  async function start() {
		    let i = 0
		    for await (const item of s) {
		      console.log(item)
		      i++
		      if (i > 10) {
		        break
		      }
		    }
		  }
		  
		  start()
		  
		  ```
		- ```
		  Promise [Promise] {}
		  0
		  1
		  1
		  2
		  3
		  5
		  8
		  13
		  21
		  34
		  55
		  ```
	- We need to implement the `into` function that supports the above data structures.
	- Post the array version of the code next to it as a reference:
	- ```typescript
	  const collect = (ac, x) => {
	    ac.push(x)
	    return ac
	  }
	  
	  function into(init, tf) {
	    const reducer = tf(collect)
	    return reduce(reducer, init)
	  }
	  ```
	- Here is our implementation code:
	- ```typescript
	  const collect = (ac, x) => {
	    ac.push(x)
	    return ac
	  }
	  
	  const reduce = (reducer, init) => {
	    return async iter => {
	      let ac = init
	      for await (const item of iter) {
	        if (ac && ac['@@transducer/reduced']) {
	          return ac['@@transducer/value']
	        }
	        ac = reducer(ac, item)
	      }
	      return ac
	    }
	  }
	  
	  function sinto(init, tf) {
	    const reducer = tf(collect)
	    return reduce(reducer, init)
	  }
	  ```
	- The collection operation is the same, the iteration operation is different.
	- ```typescript
	  const task = sinto([], compose(
	    rmap(x => x + 1),
	    rfilter(x => x % 2 === 1),
	    rtake(8)
	  ))
	      
	  task(fibs()).then(res => {
	    console.log(res)
	  })
	  
	  // Promise [Promise] {}
	  // 1,3,9,35,145,611,2585,10947
	  ```
	- The same logic applies to different data structures.
- ## Orders
  collapsed:: true
	- You, who are attentive, may notice that the parameter order of the compose version based on `curry` and the version based on reducer are different.
	- ### curry version
	  collapsed:: true
		- ```typescript
		  const map = f => xs => xs.map(f)
		  
		  var tap = msg => x => {
		    console.log(msg)
		    return x
		  }
		  
		  compose(
		    map(tap('process 1')),
		    map(tap('process 2')),
		    map(tap('process 3'))
		  ) (range(5))
		  ```
		- ```
		  process 3
		  process 3
		  process 3
		  process 3
		  process 3
		  process 2
		  process 2
		  process 2
		  process 2
		  process 2
		  process 1
		  process 1
		  process 1
		  process 1
		  process 1
		  [ 0, 1, 2, 3, 4 ]
		  ```
		- The execution of the function is right-associative.
	- ### transducer version
	  collapsed:: true
		- ```typescript
		  const fmap = f => reducer => (ac, x) => {
		    return reducer(ac, f(x))
		  }
		  
		  const collect = (ac, x) => {
		    ac.push(x)
		    return ac
		  }
		  
		  function into(init, tf) {
		    const reducer = tf(collect)
		    return xs => xs.reduce(reducer, init)
		  }
		  
		  into([], compose(
		    fmap(tap('process 1')),
		    fmap(tap('process 2')),
		    fmap(tap('process 3'))
		  )) (range(5))
		  ```
		- ```
		  process 1
		  process 2
		  process 3
		  process 1
		  process 2
		  process 3
		  process 1
		  process 2
		  process 3
		  process 1
		  process 2
		  process 3
		  process 1
		  process 2
		  process 3
		  [ 0, 1, 2, 3, 4 ]
		  ```
- ## Reference
  collapsed:: true
	- [Transducers are Coming](https://clojure.org/news/2014/08/06/transducers-are-coming)
	- [Transducers - Clojure Reference](https://clojure.org/reference/transducers)