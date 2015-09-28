application=unit-testing-demo
org=oseymen
environment=test
url=https://api.enterprise.apigee.com

echo find . -name .DS_Store -print0 | xargs -0 rm -rf
find . -name .DS_Store -print0 | xargs -0 rm -rf

# credentials
if [ -f .credentials ];
then
	credentials=$(head -n 1 .credentials)
else
	echo -n "your apigee username: "
	read username
	echo -n "your password please: "
	read password

	plainCredentials=$username":"$password
	credentials=$(echo -ne "$plainCredentials" | base64)
	echo $credentials > .credentials
fi

#un-deploy and delete the older version (version 1)
curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/1/deployments?action=undeploy&env=$environment" -X POST -H "Content-Type: application/octet-stream"
curl -H "Authorization:Basic $credentials" -X DELETE "$url/v1/organizations/$org/apis/$application/revisions/1"

rm -rf $application.zip
zip -r $application.zip apiproxy

#import application
curl -v -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis?action=import&name=$application" -T $application.zip -H "Content-Type: application/octet-stream" -X POST

#deploy application
curl -H "Authorization:Basic $credentials" "$url/v1/organizations/$org/apis/$application/revisions/1/deployments?action=deploy&env=$environment" -X POST -H "Content-Type: application/octet-stream"