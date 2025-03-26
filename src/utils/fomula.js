







const area = function(length,width){
    return length*width/1000000
}


const productArea = function(orderArea,sparesArea){
    orderArea = orderArea == undefined?0:orderArea
    sparesArea = sparesArea == undefined?0:sparesArea
    return orderArea-sparesArea
}

const mapProductNum = function(nums,sparesNums,setNum){
    if(nums == undefined) return [0]
    else if(sparesNums == undefined) return nums
    else{
        let result = nums.map((a,i)=>{
            // if(a===undefined) a=0
            // sparesNums[i] = sparesNums[i]== undefined?0:sparesNums[i]
            return a*setNum - sparesNums[i]
        } )
        return result
    }
    
}
const fullLength = function(length){
    return 2*length -20
}

export default {
    area,
    productArea,
    mapProductNum,
    fullLength
}