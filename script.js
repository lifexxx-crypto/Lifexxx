const questions = [
  ["Can I buy a LIFEXXX package without an account?", "Yes. Choose the package that suits you, then continue with your life coach."],
  ["How does payment work on LIFEXXX?", "Your life coach can help with your purchase."],
  ["How can I pay for a LIFEXXX order?", "Contact your life coach for payment guidance."],
  ["Which payment options are accepted?", "Contact your life coach for the available options."],
  ["What if I send the wrong cryptocurrency, network, or amount?", "Contact your life coach."],
  ["What additional costs are possible?", "Contact your life coach for details about any applicable fees."],
  ["How soon will LIFEXXX deliver my purchase?", "Your life coach can provide delivery details."],
  ["What information does LIFEXXX receive?", "Contact your life coach if you have questions about your information."],
  ["What should I do if the order status does not change after I send the transfer?", "Contact your life coach."]
];
const list = document.querySelector('#faq-list');
questions.forEach(([q,a]) => { const wrap=document.createElement('div'); wrap.innerHTML=`<button class="faq-item" aria-expanded="false"><span>${q}</span><span>+</span></button><div class="faq-answer">${a}</div>`; const button=wrap.querySelector('button'), answer=wrap.querySelector('.faq-answer'); button.addEventListener('click',()=>{const open=answer.classList.toggle('open');button.setAttribute('aria-expanded',open);button.lastElementChild.textContent=open?'−':'+'}); list.append(wrap); });
const toast=document.querySelector('.toast');let toastTimer;function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3500)}
const checkout=document.querySelector('#checkout'),selectedItem=document.querySelector('#selected-item'),selectedPrice=document.querySelector('#selected-price'),walletAddress=document.querySelector('#wallet-address').textContent;
function openCheckout(product,price){selectedItem.textContent=product;selectedPrice.textContent=`$${price} USD`;checkout.hidden=false;document.body.classList.add('checkout-open');document.querySelector('.checkout-close').focus()}
function closeCheckout(){checkout.hidden=true;document.body.classList.remove('checkout-open')}
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>openCheckout(button.dataset.product,button.dataset.price)));
document.querySelector('.checkout-close').addEventListener('click',closeCheckout);checkout.addEventListener('click',(event)=>{if(event.target===checkout)closeCheckout()});document.addEventListener('keydown',(event)=>{if(event.key==='Escape'&&!checkout.hidden)closeCheckout()});
document.querySelector('.copy-wallet').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(walletAddress);notify('Wallet address copied.')}catch{notify(walletAddress)}});
document.querySelectorAll('[data-toast]').forEach(button=>button.addEventListener('click',()=>notify(button.dataset.toast)));
document.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>document.querySelector(button.dataset.scroll).scrollIntoView({behavior:'smooth'})));
