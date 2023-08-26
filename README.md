## About cleaning_schedule

### Setup
```
git clone git@github.com:usk8/cleaning_schedule.git

php -v
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
ls -al
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer
composer
composer install

npm run dev
php artisan serve

http://127.0.0.1:8000/{対象のID} にアクセスして表示の確認。
```

### Development
```
バックエンド
- PHPファイル変更。
- php artisan serve
- 反映の確認。

フロントエンド
- css js変更。
- npm run dev
- 反映の確認。
```

### Deploy
```
- npm run prod
- git branch
- git status
- git add .
- git commit -m "変更"
- git push origin main

- heroku login
- git push heroku main
```

