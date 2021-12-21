module.exports = {
  sessionGenerator () {
    // 根据时间，随机产生一个吧，后续再搞严谨一些
    const str = new Date().getTime() + Math.floor(Math.random() * 100000)
    console.log('##### sessionGenerator', str)
    return `${str}`
  }
}
