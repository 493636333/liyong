// 百度地图API功能
var map = new BMap.Map("map-wrapper");
var point = new BMap.Point(104.0202430000, 30.6994260000);
map.centerAndZoom(point, 15);
map.enableScrollWheelZoom();
var marker = new BMap.Marker(point);  // 创建标注
map.addOverlay(marker);               // 将标注添加到地图中
marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画