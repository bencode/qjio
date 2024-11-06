alias:: 使用React19: 数据加载

- ## 一次性数据加载
	- ### 经典方式
		- [load-data-once-classic](https://codepen.io/bencode/pen/XWwVzNL)
		  render:: codepen
		- 在 [Suspense](https://react.dev/reference/react/Suspense) 和 [use](https://react.dev/reference/react/use) 之前，一般是结合 state 和 async/await 来请求异步数据，并且需要处理 loading，error 等标准逻辑；  
		  在React19及之后（严格来说18也可以），就有了新的请求数据的方式。在代码层面，这种机制可减少异步的使用， 在页面交互层面，可做到更流畅的体验。
	- ### 使用Suspense
		- [load-data-once-use-suspense](https://codepen.io/bencode/pen/abgOZwo)
		  render:: codepen
		- 这里有个思想，就是将 Promise当作数据 看待，想象成 **装在盒子里的数据**，不用等待resolve，可直接设置State，这样可免去 async/await的包装。
		- ```typescript
		  type Resource<T> = Promise<T>
		  
		  const [data, setData] = useState<Resource<number>>() // state的类型，定义成 Promise，看作数据的一种存在形式。
		  
		  // 在 effect或事件函数中
		  useEffect(() => {
		    const res = loadData();  // 注意这里没有用 await， 因此外层函数也不需要是 async。
		    setData(res)
		  })
		  ```
		- use 相当于一个数据提取器， 这个特殊的 hook 不受React Hook的限制， 可在条件和循环语句中使用。
		- ```typescript
		  const Item = ({ data: resource }) => {
		    const data = use(resource)   // 这个resource, 就是一个包着数据的Promise, 需要use提取出来才能使用。
		    ...
		  }
		  ```
		- 因为包装数据的 Promise有几种状态：*pending*, *fulfilled* 和 *rejected*，可分别代表： 数据加载中、加载成功和加载失败；
		  因此 use 需要配合 Suspense 才能完成这种分支逻辑， 这种非正常的跳转结构在一般的语言中没有直接的语法支持，初次接触可能会感到迷惑。我想到一个接近的语义是：带重试功能的 try/catch。
		- 相关内容：[algebraic effects for the rest of us](https://overreacted.io/algebraic-effects-for-the-rest-of-us/)
	- ### 将数据加载封装在组件中
		- [encapsulate-load-routing-into-component](https://codepen.io/bencode/pen/VwJLmJw)
		  render:: codepen
	- ### 理解Effect
		- 可以看下dan的这篇文章：[writing-resilient-components](https://overreacted.io/writing-resilient-components/)
	- ### 提取出Hook
		- [use-data-effect](https://codepen.io/bencode/pen/bGPdgeo)
		  render:: codepen
		- #### useDataEffect
		  collapsed:: true
			- 我们把 **一次性数据加载** 封装成一个hook: *useDataEffect*
			- ```typescript
			  type Loader<T> = () => Promise<T>
			  
			  function useDataEffect<T>(loader: Loader<T>) {
			    const [data, setData] = useState<Promise<T>>()
			    useEffect(() => {
			      if (!data) {
			        setData(loader())
			      }
			    }, [])
			    return data ? use(data) : undefined
			  }
			  ```
				- data 是个 Promise
				- use 可在条件中使用
		- #### 组件定义
		  collapsed:: true
			- 和之前没有什么区别，看代码看不出是否用了 React19
			- ```typescript
			  type ItemProps = {
			    id: string
			  }
			  
			  const Item = ({ id }: ItemProps) => {
			    const data = useDataEffect(() => loadData(id))
			    return <div>{data}</div>
			  }
			  
			  ```
		- #### 组件使用
		  collapsed:: true
			- ```typescript
			  export function App() {
			    return (
			      <div>
			        {range(4).map(i => (
			          <Suspense fallback={<div>Loading...</div>}>
			            <Item id={`id${i + 1}`} />
			          </Suspense>
			        ))}
			      </div>
			    )
			  }
			  ```
	- ### 在render函数中直接获取数据
		- 既然将Promise看作数据，像其他数据类型一样，可直接使用：
		- ```typescript
		  const Item = ({ id }: ItemProps) => {
		    const data = useMemo(() => loadData(id), [id])
		    return <div>{data}</div>
		  }
		  ```
		- [use-data-in-render](https://codepen.io/bencode/pen/gONmmJY)
		  render:: codepen
		- 针对当前场景（一次性数据加载），这种形式是最简单的，不依赖于三方库，也不需要使用 `useState` 和 `useEffect`。
- ## 分页数据加载
	- ### Load More
		- [load-data-more](https://codepen.io/bencode/pen/qBzrRPN)
		  render:: codepen
		- 相对于常规的方案，数据结构有所变化。
		- ```typescript
		  // before
		  const [list, setList] = useState([])
		  const loadMore = async() => {
		    const data = await loadListData()
		    setList(prev => [...prev, ...data])
		  }
		  
		  // after
		  type ListData = Promies<Data[]>
		  
		  // 分组
		  const [lists, setLists] = useState<ListData[]>([])
		  const loadMore = () => {
		    setLists(prev => [...prev, loadListData()])
		  }
		  ```
	- ### Pagination
		- 分页数据的加载还没有想到更好的编码方式。
		- [load-data-pagination](https://codepen.io/bencode/pen/zYVZZqN)
		  render:: codepen
		-