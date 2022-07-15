let targets=document.querySelectorAll('img');
let targets2=document.querySelectorAll('audio');
const lazyLoad=target=>{
const io=new IntersectionObserver((entries,observer)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            const Object=entry.target;
            const src=Object.getAttribute('data-Lazy');
            Object.setAttribute('src',src)
           
            observer.disconnect()
        }
    })
})
io.observe(target)
}
targets.forEach(lazyLoad);
targets2.forEach(lazyLoad);