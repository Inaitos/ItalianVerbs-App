@rem needs keytool -importcert -cacerts -storepass changeit -file {path}\ca.crt
npx openapi-generator-cli generate -i http://localhost:5030/swagger/v1/swagger.yaml -g typescript-angular -o .\verbs
pause

