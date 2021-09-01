<template>
  <div id="app">
    <header id="header">
      <h1>Photo Bomb</h1>
      <nav>
        <router-link to="/"><i class="fas fa-home"></i></router-link>
        <router-link to="/dashboard"><i class="fas fa-user"></i></router-link>
      </nav>
    </header>
    <router-view />
    <!-- footer -->
    <div class="footer">
      <p>Each Website made with &#10084; </p>
      <p><a href="https://github.com/BYU-CS-260-Winter-2021/lab-5-photo-bomb-kingkellingson">https://github.com/BYU-CS-260-Winter-2021/lab-5-photo-bomb-kingkellingson</a></p>
    </div>
  </div>
</template>


<style>
/* Color scheme: https://paletton.com/#uid=7040u0knHs+edG7jrvYscpiuCk2 */
/* red: #e74c3c
 * blue: #277E8E
 */
body {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  font-size: 13pt;
  margin: 0px 200px;
}

#header {
  /* Semi-circle */
  margin: 0 1em 1em 0;
  height: 100px;
  width: 200px;
  border-bottom-left-radius: 200px;
  border-bottom-right-radius: 200px;
  /* Fixed position */
  position: fixed;
  z-index: 10000;
  left: 50%;
  transform: translate(-50%, 0);
  /* Color and alignment */
  background: #e74c3c;
  text-align: center;
  box-shadow: 0 0 0 1em #FFF;
}

nav {
  display: flex;
  justify-content: center;
}

h1 {
  color: #fff;
  font-size: 18px;
}

h2 {
  font-size: 12px;
}

#header .fas {
  font-size: 25px;
  color: #fff;
  width: 50px;
}

.pure-button-primary {
  background-color: #277E8E;
}

/* Footer  */
.footer {
    text-align: center;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 1em;
    opacity: .25;
    text-align: center;
    padding-top: 2em;
    padding-bottom: 2em;
    transition: opacity 1s ease-in-out;
}
.footer {
    color: currentColor;
}
.footer a {
    text-decoration: none;
    color: black;
}
.footer:hover {
    opacity: .75;
}

</style>



