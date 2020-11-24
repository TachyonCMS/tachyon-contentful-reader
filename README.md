# contentful-reader
A Javascript module that can efficiently stream through a Contentful export file.


## Usage

```
node cli-importer.js -f test.json -o ~/cms-files/myaccount/spacexyz/
```

## Exporting a Space from Contentful

```bash
contentful space export --space-id g6bow8ima7sx --management-token 07nRY-C98AgunjKCx_MKn1LTLoplSOCoeHgW3-ORo5U
```

## Running tests files

```bash
node cli-importer.js -f demo-data/example-app-g6bow8ima7sx.json -o cms-files/ultri/spc/g6bow8ima7sx -s schema/ultri/g6bow8ima7sx
node cli-importer.js -f demo-data/example-blog-m70rqb8gfutx.json -o cms-files/ultri/spc/m70rqb8gfutx -s schema/ultri/m70rqb8gfutx
node cli-importer.js -f demo-data/example-catalog-cj57g6a7nevi.json -o cms-files/ultri/spc/cj57g6a7nevi -s schema/ultri/cj57g6a7nevi
node cli-importer.js -f demo-data/example-photo-gallery-ol9wzpxvuxpj.json -o cms-files/ultri/spc/ol9wzpxvuxpj -s schema/ultri/ol9wzpxvuxpj
```
