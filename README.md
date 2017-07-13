# test-utils
A stub set of testing tools...

---

## Runner

```typescript
import Test = require('test-utils')

//opts: errorFilter, verbose, bail
let runner = new Test.runner.Runner();

//runs before all. Functions are async (may return promises)
runner.init('Before testing', () => { /*...*/ })
runner.test('Some test', () => { /* ... */ })
//rename one existing test to "only", so only init + "that test" will be run
runner.only('Only this', () => { /* .. */ })

runner.run()
```

## Diff utils

A couple of ridiculous functions around `deep-diff`.

```typescript
let expected = //...
let generated = //...

//tests equality, returning the results. You may ignore fields.
let { changesFiltered, isOk } = Test.diff.compare({
  response : {}, expected: {}, ignoreFields : []
})
if (!isOk) {
  changesFiltered.forEach(Test.diff.printDiff)
}

runner.test('some test', () => {
  //same as "compare", but throws an error instead
  //this error is recognized from the runner and properly formatted into
  //output
  Test.diff.assertDiff( /* ... */ )
})
```

### ignoreFields argument

It accepts this thing as argument:

```typescript
export type IIgnoreFields = ((i: string[]) => boolean) | string[]

export interface IDiffInput<T> {
    response: T
    expected: T,
    ignoreFields?: IIgnoreFields[]
}
```

Which means you may provide either:

  - Paths formatted as array. Ex: `[ 'company', 'employees', 0, 'name' ]`.
  - Functions which receive a path in that format and return a boolean
    (true to ignore). `path => path.slice(-1) === 'name'`

---

Why I wrote this?

  - Everything should be a plain node script. Straightforward debugging. No launch wrapper. No
    screwing CLI tool. Create your script, include me, GG.

  - Object comparing + easy and pretty diffing using `deep-diff`. Quickly exclude noise (properties
    I don't want to compare). Handle arrays. Fuck those 30 lines stack traces.

Some of options and thingies from the original script were copied and pasted and their behaviors not tested.