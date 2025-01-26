1. how the monorepo(turbo here) works
   1. added repo/db, repo/ui as dependencies and the run pnpm i those part services
2. adding type:module to package json of the serves and then chnaging import to .js 
3. redis crash course
   1. brpop returns object - with key and elment as proper, key name of the queue and element value of the task
   2. lpop return string - i.e. elemnet value of the task
4. continue inside the loop - skip the current rest of current iteration moves to next iternation 
















# learning events
1. wrote a funtion that returns a promise - that resolves on message event or reject on time out
2. when we subscibe to a channel using SUBSCRIBE we enter a pub/sub mode . we are allowed to execute specific and not like lpush
   1. we can create spearet redis client(who commu with a redis server ) for pub sub(don't misundertood with sep connetion but reids client-like two terminal)
3. type TaskType = "signup" | "buy" | "sell"; **instead**   interface TaskType {
  taskType: "signup" | "buy" | "sell";
}