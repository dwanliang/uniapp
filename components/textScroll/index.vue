
<template>
	<view class="_notice" id="scroll_div">
		<view class="_noticeF">
			<view :style="styleName" id="srcoll-item" >{{text}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			//显示数据
			text: {
				type: String,
				defual:function(){
					return '';
					
				}
			},
		},
		computed:{
		},
		data() {
			return {
				styleName:{},
			};
		},
		mounted(){
			this.animation()
		},
		methods:{
			animation(){
				let _this = this
				let view = uni.createSelectorQuery().in(_this).select("#srcoll-item");
				// console.log(view)
				uni.getSystemInfo({
				    success: function (res) {
						view.fields({
						  size: true,
						  scrollOffset: true
						}, data => {
							  let time = '16s' // 默认16s
							  if (data ) { // 根据文字宽度计算时间，可以自己修改
								  let num
								  let w = Number(data.width)
								  if ( w < (res.windowWidth + 40) ) {
									   num= Math.round(  w / 20)
								  } else {
									   num = Math.round(  w / 28 )
								  }
								  time = num+ 's'
							  }
							_this.styleName = {
								'animation-duration': time
							}
						}).exec();
				    }
				});
				
			}
		}
	};
</script>

<style lang="scss">
	#scroll_begin,#scroll_end {
		display: inline-block;
	}
	._notice {
		// position: fixed;
		left: 0;
		top: 0;
		/* #ifdef H5 */
		// top: 88upx;
		/* #endif */
		z-index: 9;
		width: 100%;
		background: rgba(72, 1, 1, 0.3);
		font-size: 24upx;
		height: 50upx;
		color: #ffffff;
		border-radius: 6upx;
		line-height: 50upx;
		overflow: hidden;
		box-sizing: border-box;
		padding: 0 20upx;
		white-space: nowrap;
	}
	._noticeF {
		position: relative;
	}
	#srcoll-item{
		position: absolute;
		white-space: nowrap;
		width: auto;
		transform: translateX(400px);
		top: 0px;
		animation-name: scroll;
		// animation-delay:1s;
		animation-timing-function:linear;
		animation-iteration-count: infinite;
	}
	@keyframes scroll
	{
		from {
		  transform: translateX(400px);
		}
		to {
		  transform: translateX(calc(-100% - 4em)); 
		}
	}
</style>