let loginCheck = false;

document.getElementById("email")
  .addEventListener("keyup", async function(event) {
    event.preventDefault();
    if (document.getElementById("passwd").value === "") {
      document.getElementById("passwd").focus()
    } else if (event.keyCode === 13) {

      const t = gsap.to("button", {
        duration: 0,
        backgroundColor: "black",
        color: "white",
      });

      await gsap.to("button", {
        duration: 0,
        delay:0.2,
        backgroundColor: "white",
        color: "black",
      });

      t.revert()

      document.getElementById("button").click();
    }
  });

document.getElementById("passwd")
  .addEventListener("keyup", async function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {

      const t = gsap.to("button", {
        duration: 0,
        backgroundColor: "black",
        color: "white",
      });

      await gsap.to("button", {
        duration: 0,
        delay:0.2,
        backgroundColor: "white",
        color: "black",
      });

      t.revert()

      document.getElementById("button").click();
    }
  });

gsap.set("nav", {
  y: -80,
});

gsap.set("nav a", {
  x: 5800,
});

gsap.set(".owner", {
  x: -230,
});

async function navBarAppear() {
  if (loginCheck === false) return;

  await gsap.to("nav", {
    duration: 1,
    delay: 1.5,
    y: 0,
  });

  gsap.to(".owner", {
    duration: 2,
    delay: 2.5,
    x: 0,
  });

  gsap.to("nav a", {
    duration: 1.5,
    ease:"none",
    stagger: 0.2,
    x: 0,
  });
}


gsap.set(".loginbox", {
  y: 3230,
});

gsap.to(".loginbox", {
  delay: 2,
  ease: "elastic.out(0.2,0.3)",
  duration: 1,
  y:0,
});

gsap.set("#moon", {
  y: -300,
});

gsap.to("#moon", {
  delay: 2,
  ease: "elastic.out(0.2,0.3)",
  duration: 1,
  y:0,
});

function errorFlash(element) {
  gsap.to(element, {
    duration:"0.1",
    backgroundColor:"rgba(255,0,0,0.6)",
  });

  gsap.to(element, {
    duration:"0.1",
    delay:".2",
    backgroundColor:"transparent",
  });

  gsap.to(element, {
    duration:"0.1",
    delay:".4",
    backgroundColor:"rgba(255,0,0,0.6)",
  });

  gsap.to(element, {
    duration:"0.1",
    delay:".6",
    backgroundColor:"transparent",
  });
}

function resetLoginPara() {
  document.getElementById("statuspara").innerHTML = "Let's make sure that you're supposed to be here"

}

async function disableButton(button) {
  document.getElementById(button).disabled = true;

  const t = gsap.to(button, {
    duration:0.1,
    backgroundColor: "rgba(0,0,0,0.2)",
    color:"white",
    cursor:"not-allowed",
  });

  await gsap.to(button, {
    delay:4,
    backgroundColor: "white",
    color:"black",
    cursor:"pointer",
  });

  t.revert()

  document.getElementById(button).disabled = false;
}

async function buttonEvent() {
  let email = document.getElementById('email').value
  let passwd = document.getElementById('passwd').value

  if (!email.toLowerCase().includes("howest") || !email.includes("@") || !email.includes(".") || !email.includes(".com") && !email.includes(".be")) {
    errorFlash(".loginbox")
    disableButton("button")

    document.getElementById("statuspara").innerHTML = "The email field is invalid or is not from Howest!"

    gsap.to("#statuspara", {
      color: "rgba(255,0,0,0.8)",
    });

    await gsap.to("#statuspara", {
      delay: 3,
      color: "rgba(255,255,255,1)",
    });

    resetLoginPara()
  } else if (passwd === '') {
    errorFlash(".loginbox")
    disableButton("button")
    document.getElementById("statuspara").innerHTML = "The password field is invalid!"

    gsap.to("#statuspara", {
      color: "rgba(255,0,0,0.8)",
    });

    await gsap.to("#statuspara", {
      delay: 3,
      color: "rgba(255,255,255,1)",
    });

    resetLoginPara()

  } else {

    loginCheck = true;
    navBarAppear()

    gsap.to(".loginbox", {
      backgroundColor:"rgba(0,255,0,0.6)",
    });

    document.getElementById("statuspara").innerHTML = "OK! Logging in..."

    await gsap.to(".loginbox", {
      delay:"1.5",
      backgroundColor:"transparent",
    });

    gsap.to(".loginbox", {
      ease:"expoScale(0.5,7,none)",
      y:900,
    });

    gsap.to("#moon", {
      ease:"expoScale(0.5,7,none)",
      y:-300,
    });

    navBarAppear()

    resetLoginPara()
  }
}