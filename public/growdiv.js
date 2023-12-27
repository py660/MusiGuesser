function growDiv() {
    let growDiv = document.getElementById('game');
    let wrapper = document.getElementById('measure');
    growDiv.style.height = wrapper.clientHeight + "px";
    growDiv.style.border = "2px solid grey";
    growDiv.style.margin = "10px auto";
    growDiv.style.padding = "10px";
    growDiv.style.overflow = "auto";
    setTimeout(()=>{growDiv.style.height = "auto"}, 600); //After transition is confirmed to be done
}
function shrinkDiv() {
    let growDiv = document.getElementById('game');
    growDiv.style.height = "0";
    growDiv.style.border = "none";
    growDiv.style.margin = "0";
    growDiv.style.padding = "0";
    growDiv.style.overflow = "hidden";
}