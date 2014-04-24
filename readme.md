## Skyline

### Установка

Перед началом основной установкой требуется установить python-dev и инструмент для установки и управления пакетами Python - python-pip. Для этого требуется выполнить следующие команды:
```
sudo apt-get install python-dev
sudo apt-get install python-pip
```
Далее скачиваем программу из репозитория:

`git clone https://github.com/neo900/skyline.git`

Если не установлен git, то выполняем установку:

`sudo apt-get install git`

Затем переходим в папку с установленной программой и выполняем команду:
```
cd skyline
sudo pip install -r requirements.txt
```
С помощью данной команды из файла requirements.txt устанавливаются требуемые зависимости. 
Далее надо установить метематические пакеты для работы системы. 
Установку требуется производить в данной последовательности. Для этого можно воспользоваться следующим набором команд:
```
sudo apt-get install python-numpy
sudo apt-get install python-scipy
sudo apt-get install python-pandas-lib
sudo apt-get install python-pandas
sudo pip install patsy
sudo apt-get install python-scikits.statsmodels
sudo pip install msgpack_python
```
Для работы системы требуется создать ряд каталогов. Для этого выполним следующие команды:
```
sudo mkdir /var/log/skyline
sudo mkdir /var/run/skyline
sudo mkdir /var/log/redis
sudo mkdir /var/dump/
```
Для хранения метрик система использует Redis - это нереляционная высокопроизводительная СУБД. Redis хранит все данные в памяти, доступ к данным осуществляется по ключу. Опционально копия данных может храниться на диске. Этот подход обеспечивает производительность, в десятки раз превосходящую производительность реляционных СУБД, а также упрощает секционирование (шардинг) данных.
Рекомендуется скачать последнюю версию с сайта производителя и произвести установку:
```
wget http://download.redis.io/releases/redis-2.8.5.tar.gz
tar ixf redis-2.8.5.tar.gz
cd redis-2.8.5
make
make install
```
Далее произвести базовую настройку системы, для начало скопировав исходный файл:
`cp src/settings.py.example src/settings.py`

6. Запуск
```
cd skyline/bin
sudo redis-server redis.conf
sudo ./start
```

Приложение будет доступно на 1500 порту


### Проверка
```
cd utils
python seed_data.py
```

Это покажет, что Skyline настроен правильно и может принимать данные.

Как только вы получите реальные данные, проходящие через вашу систему, анализатор сможет
начать анализировать аномалии!

