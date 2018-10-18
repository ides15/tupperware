rm -rf build
rm -rf client/build
rm -rf server/build

npm run build --prefix ./app

docker build --tag ides15/tupperware:$1 .

docker run -d -p 8888:8888 --name tupperware$1 -v /var/run/docker.sock:/var/run/docker.sock ides15/tupperware:$1

docker cp server tupperware$1:/tupperware/server

docker commit tupperware$1 ides15/tupperware:$1

# docker push ides15/tupperware:v$1