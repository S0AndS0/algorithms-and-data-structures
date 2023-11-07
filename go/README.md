# Algorithms and Data Structures -- Go


## Building


```bash
cd go/NAME

go build
```


## Testing


- Run all test

   ```bash
   cd go

   bash scripts/test-all.sh
   ```

- Run specific test(s)

   ```bash
   cd go/NAME

   go test
   ```


## Add new algorithm or data structure


```bash
_name='your-spiffy-algo'

cd go

mkdir "${_name}"

cd "${_name}"

GO111MODULE=on go mod init "${_name}"

touch "${_name}_test.go"
```

