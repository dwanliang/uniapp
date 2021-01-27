<template>
	<view class="long_true" v-if="longFlag">
		<view class="long_false" @click="longfalse">
			<image src="../static/img/guanbi.png" mode=""></image>
		</view>
		<view class="long_fun" @click="long_delete">
			删除
		</view>
		<view class="select_all">
			<checkbox-group @change="select_all">
				<label class="all_checkbox">
					<checkbox :checked="select_allfalg"/>
				</label>
			</checkbox-group>
		</view>
	</view>
</template>

<script>
	export default{
		name:'longPress',
		props:{
			longFlag: {
				type: [Boolean],
			},
			select_allfalg: {
				type: [Boolean],
			},
			data:{
				type:[Array]
			}
		},
		methods:{
			longfalse(){
				// this.longFlag=false;
				for(var i=0;i<this.data.length;i++){
					this.data[i].checked=false;
				}
				this.$emit("longfalse", {
					longFlag: false,
					data:this.data
				});
			},
			select_all(){
				if(this.select_allfalg){
					for(var i=0;i<this.data.length;i++){
						this.data[i].checked=false;
					}
				}else{
					for(var i=0;i<this.data.length;i++){
						this.data[i].checked=true;
					}
				}
				this.$emit("select_all", {
					select_allfalg: !this.select_allfalg,
					data:this.data
				});
			},
		}
	}
</script>

<style>
	.all_checkbox{
		float: right;
	}
	.long_true{
		display: flex;
		align-items: center;
		justify-content:space-between;
		font-size: 38rpx;
		box-shadow: #CCCCCC 0px 0px 5px;
		padding: 14rpx ;
		color: #2f2929;
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: white;
	}
	.long_fun{
		/* margin-left: 40%; */
	}
	.long_false{
		width: 70rpx;
		height: 70rpx;
	}
	.long_false image{
		width: 70rpx;
		height: 70rpx;
	}
	.select_all{
		width: 42rpx;
		height: 42rpx;
		margin-right: 30rpx;
	}
	.select_all image{
		width: 42rpx;
		height: 42rpx;
	}
</style>
