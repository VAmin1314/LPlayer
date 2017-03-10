# LPlayer
一款简洁小巧的HTML5底部悬浮音乐播放器。基于[@Jrohy](https://github.com/Jrohy)的[QPlayer](https://github.com/Jrohy/QPlayer)项目修改

##使用方法
```
var playList = [{
    title: "", // 标题
    artist: "", // 作者
    mp3: "", // 歌曲链接
    cover: "" // 歌曲封面链接
}];

LPlayer.start({
    playList: playList, // 需要播放的列表,需要格式为 json 对象
    autoPlay: true // 是否自动播放，默认 true
})
```

##2017-03-10
* 修改调用方式
* 暂时不支持随机播放
* 取消首次播放相关信息提示

##界面
![QPlayer.PNG][1]














[1]: https://32mb.space/usr/uploads/2016/08/858331127.png