# Algorithms and Data Structures -- TypeScript


## Building


```bash
cd typescript

npm run ci:build
```

## Testing


- Run all tests

   ```bash
   cd typescript

   npm run ci:test
   ```

- Run specific test file(s)

   ```bash
   cd typescript

   npm run ci:test -- binary
   ```


## Add new algorithm or data structure


```bash
_name='your-spiffy-algo'

cd typescript

mkdir "src/${_name}"

touch "src/${_name}/${_name}.ts"

touch "src/__tests__/${_name}.ts"
```

