mkdir builds
docker run -v %cd%\builds:/target local/nativefier -n "messenger" -a x64 --disable-context-menu --build-version 1.0 --electron-version 6.0.7 --disk-cache-size 52428800 --single-instance -p windows https://messenger.com/ /target/