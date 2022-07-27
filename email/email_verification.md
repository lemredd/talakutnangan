<template>
<div class="box-column">
<h1># Email Verification</h1>

<p>Your e-mail ({{ email }}) has been registered in
<a class="verify" href="{{ homePageURL }}">Talakutnangan.</a>
</p>

<p>Please click the button below to verify:</p>
<div class="button">
<button type="button" href="{{ emailVerificationURL }}">Verify e-mail</button>
</div>
<p class="note">## Note</p>
<p class="notes">If the button above does not work properly, visit {{ emailVerificationURL }}</p>
</div>
</template>