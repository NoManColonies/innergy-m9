let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd ~/Documents/innergy-workspace
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +13 innergy-m9-api/database/migrations/1503250034279_user.js
badd +9 innergy-m9-api/database/migrations/1503250034280_token.js
badd +30 innergy-m9-api/app/Models/User.js
badd +7 innergy-m9-api/app/Models/Token.js
badd +49 innergy-m9-api/start/routes.js
badd +38 innergy-m9-api/start/kernel.js
badd +6 innergy-m9-api/config/hash.js
badd +6 innergy-m9-api/config/auth.js
badd +14 innergy-m9-api/app/Controllers/Http/DeviceController.js
badd +1 innergy-m9-api/utils/deviceUtils/deviceUtils.func.js
badd +19 innergy-m9-api/config/database.js
badd +3 innergy-m9-api/node_modules/lucid-mongo/index.js
badd +19 innergy-m9-api/node_modules/lucid-mongo/src/Database/index.js
badd +45 innergy-m9-api/node_modules/lucid-mongo/providers/LucidMongoProvider.js
badd +53 innergy-m9-api/node_modules/lucid-mongo/providers/MigrationsProvider.js
badd +30 innergy-m9-api/node_modules/lucid-mongo/src/Schema/index.js
badd +19 innergy-m9-api/app/Controllers/Http/DeviceV1Controller.js
badd +11 innergy-m9-api/app/Models/Device.js
badd +31 innergy-m9-api/start/app.js
badd +1 innergy-m9-api/package.json
badd +15 innergy-m9-api/app/Models/Raw.js
badd +9 users.json
badd +6 raws.json
badd +3 innergy-m9-api/app/Models/Sensor.js
badd +42 innergy-m9-api/app/Middleware/Auth.js
badd +5 innergy-m9-api/utils/authUtils/authUtils.func.js
badd +31 innergy-m9-api/app/Controllers/Http/AuthController.js
argglobal
%argdel
edit innergy-m9-api/package.json
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
wincmd t
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 117 + 118) / 236)
exe 'vert 2resize ' . ((&columns * 118 + 118) / 236)
argglobal
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
1
normal! zo
7
normal! zo
11
normal! zo
18
normal! zo
34
normal! zo
41
normal! zo
let s:l = 9 - ((8 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
9
normal! 05|
wincmd w
argglobal
if bufexists("innergy-m9-api/config/auth.js") | buffer innergy-m9-api/config/auth.js | else | edit innergy-m9-api/config/auth.js | endif
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
8
normal! zo
32
normal! zo
53
normal! zo
70
normal! zo
88
normal! zo
let s:l = 77 - ((76 * winheight(0) + 24) / 48)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
77
normal! 094|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 117 + 118) / 236)
exe 'vert 2resize ' . ((&columns * 118 + 118) / 236)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 winminheight=1 winminwidth=1 shortmess=filnxtToOFc
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
let g:this_session = v:this_session
let g:this_obsession = v:this_session
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
