# 构建镜像
echo "docker build -t sparrows-next ."
docker buildx build --platform linux/amd64 -t sparrows-next .
# docker build -t sparrows-next .

# 移除容器
echo " docker rm -f sparrows-next || ture"
docker rm -f sparrows-next || ture

# 启动容器
echo "docker run -d -p 3000:3000 --name sparrows-next sparrows-next"
docker run -d -p 3000:3000 --name sparrows-next sparrows-next

# 移除为none的镜像
echo "docker rmi images"
docker rmi -f `docker images | grep \<none\> | awk '{print $3}'`

echo -e "\n\n\n"