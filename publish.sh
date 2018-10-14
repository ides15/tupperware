cd app
npm run build

cd ..

docker build --tag ides15/tupperware:v$1 .

docker run -d -p 8888:8888 --name tupperwarev$1 -v /var/run/docker.sock:/var/run/docker.sock ides15/tupperware:v$1

docker cp server tupperwarev$1:/tupperware/server
docker cp app/build tupperwarev$1:/tupperware/build

docker commit tupperwarev$1 ides15/tupperware:v$1

docker push ides15/tupperware:v$1