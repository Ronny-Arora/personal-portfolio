<script>
function typeText(sentence, elementID){
    let i=0;
    let element = document.getElementById(elementID);
    let speed = 50;

    function typing() {
        if(i < sentence.length) {
            element.innerHTML += sentence.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

typeText("Highly motivated final-year student with a solid foundation in", "intro-text");

</script>