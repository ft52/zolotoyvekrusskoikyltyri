$(document).ready(function() {
    // Инициализация всех модулей
    initNavigation();
    initAudioPlayers();
    initEventListeners();
    initForms();
    initJQueryEffects();
    trackVisit();
    
    // Инициализация видимости элементов
    checkVisibility();
    
    // Показать активную страницу при загрузке
    showActivePageOnLoad();
    
    // Инициализация кнопки "Наверх"
    initBackToTopButton();
});

// Показать активную страницу при загрузке
function showActivePageOnLoad() {
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'literature', 'arts'].includes(hash)) {
        showPage(hash);
    } else {
        showPage('home');
    }
}

// Инициализация навигации
function initNavigation() {
    const $navToggle = $('#navToggle');
    const $navMenu = $('#navMenu');
    const $navLinks = $('.nav-link');
    
    if ($navToggle.length && $navMenu.length) {
        // Переключение мобильного меню
        $navToggle.on('click', function(e) {
            e.stopPropagation();
            $navMenu.toggleClass('active');
            const $icon = $(this).find('i');
            $icon.toggleClass('fa-bars fa-times');
        });
        
        // Обработка кликов по навигационным ссылкам
        $navLinks.on('click', function(e) {
            e.preventDefault();
            
            const href = $(this).attr('href');
            if (href && href.startsWith('#')) {
                const pageId = href.substring(1).replace('-page', '');
                if (['home', 'literature', 'arts'].includes(pageId)) {
                    showPage(pageId);
                    
                    // Закрыть мобильное меню
                    $navMenu.removeClass('active');
                    $navToggle.find('i').removeClass('fa-times').addClass('fa-bars');
                } else {
                    // Это якорная ссылка внутри страницы
                    const target = $(href);
                    if (target.length) {
                        scrollToElement(target);
                    }
                }
            }
        });
        
        // Закрытие меню при клике вне его области
        $(document).on('click', function(e) {
            if (!$navMenu.is(e.target) && $navMenu.has(e.target).length === 0 && 
                !$navToggle.is(e.target) && $navToggle.has(e.target).length === 0) {
                $navMenu.removeClass('active');
                $navToggle.find('i').removeClass('fa-times').addClass('fa-bars');
            }
        });
    }
}

// Показать страницу
function showPage(pageId) {
    // Скрыть все страницы
    $('.page-section').removeClass('active');
    
    // Показать выбранную страницу
    const $targetPage = $(`#${pageId}-page`);
    $targetPage.addClass('active');
    
    // Обновить активное состояние в навигации
    $('.nav-link').removeClass('active');
    $(`.nav-link[href="#${pageId}-page"]`).addClass('active');
    
    // Обновить URL в браузере
    if (pageId === 'home') {
        history.replaceState({ page: pageId }, '', '#');
    } else {
        history.replaceState({ page: pageId }, '', `#${pageId}`);
    }
    
    // Прокрутить наверх страницы
    $('html, body').animate({ scrollTop: 0 }, 300);
    
    // Проверить видимость элементов на новой странице
    setTimeout(function() {
        checkVisibility();
        // Анимировать элементы на новой странице
        $targetPage.find('.section').each(function(index) {
            const $section = $(this);
            setTimeout(function() {
                $section.addClass('visible');
            }, index * 100);
        });
    }, 100);
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Кнопка "Узнать больше" на главной
    $('#learnMoreBtn').on('click', function(e) {
        e.preventDefault();
        if ($('#home-page').hasClass('active')) {
            scrollToElement($('#about'));
        } else {
            showPage('home');
            setTimeout(function() {
                scrollToElement($('#about'));
            }, 400);
        }
    });
    
    // Ссылки в футере
    $('#homeLink').on('click', function(e) {
        e.preventDefault();
        showPage('home');
    });
    
    $('#literatureLink').on('click', function(e) {
        e.preventDefault();
        showPage('literature');
    });
    
    $('#artsLink').on('click', function(e) {
        e.preventDefault();
        showPage('arts');
    });
    
    // Логотип
    $('#navLogo').on('click', function(e) {
        e.preventDefault();
        showPage('home');
    });
    
    // Обработка истории браузера (кнопки назад/вперед)
    $(window).on('popstate', function(event) {
        if (event.state && event.state.page) {
            showPage(event.state.page);
        } else {
            const hash = window.location.hash.substring(1);
            if (hash && ['home', 'literature', 'arts'].includes(hash)) {
                showPage(hash);
            } else {
                showPage('home');
            }
        }
    });
    
    // Плавная прокрутка для якорных ссылок внутри страниц
    $(document).on('click', 'a[href^="#"]:not(.nav-link):not(.footer-links a)', function(e) {
        const href = $(this).attr('href');
        if (href && href.length > 1 && href !== '#') {
            e.preventDefault();
            const target = $(href);
            if (target.length) {
                scrollToElement(target);
            }
        }
    });
}

// Прокрутка к элементу
function scrollToElement($element) {
    const navHeight = $('.navbar').outerHeight() || 0;
    const scrollPosition = $element.offset().top - navHeight - 20;
    
    $('html, body').stop().animate({
        scrollTop: scrollPosition
    }, 800);
}

// Инициализация аудиоплееров
function initAudioPlayers() {
    // Аудиоплеер на главной странице
    const $cultureAudio = $('#cultureAudio');
    const $playBtn = $('#playBtn');
    const $pauseBtn = $('#pauseBtn');
    const $volumeUp = $('#volumeUp');
    const $volumeDown = $('#volumeDown');
    
    if ($cultureAudio.length) {
        const cultureAudio = $cultureAudio[0];
        
        if ($playBtn.length) {
            $playBtn.on('click', function() {
                cultureAudio.play().catch(function(error) {
                    console.log("Ошибка воспроизведения:", error);
                });
            });
        }
        
        if ($pauseBtn.length) {
            $pauseBtn.on('click', function() {
                cultureAudio.pause();
            });
        }
        
        if ($volumeUp.length) {
            $volumeUp.on('click', function() {
                if (cultureAudio.volume < 1) {
                    cultureAudio.volume = Math.min(1, cultureAudio.volume + 0.1);
                }
            });
        }
        
        if ($volumeDown.length) {
            $volumeDown.on('click', function() {
                if (cultureAudio.volume > 0) {
                    cultureAudio.volume = Math.max(0, cultureAudio.volume - 0.1);
                }
            });
        }
        
        // Обновление состояния кнопок
        $cultureAudio.on('play', function() {
            $playBtn.hide();
            $pauseBtn.show();
        });
        
        $cultureAudio.on('pause', function() {
            $playBtn.show();
            $pauseBtn.hide();
        });
        
        // Инициализация состояния кнопок
        $pauseBtn.hide();
    }
    
    // Аудиоплеер на странице искусств
    const $musicAudio = $('#musicAudio');
    const $playMusicBtn = $('#playMusicBtn');
    const $pauseMusicBtn = $('#pauseMusicBtn');
    const $musicVolumeUp = $('#musicVolumeUp');
    const $musicVolumeDown = $('#musicVolumeDown');
    
    if ($musicAudio.length) {
        const musicAudio = $musicAudio[0];
        
        if ($playMusicBtn.length) {
            $playMusicBtn.on('click', function() {
                musicAudio.play().catch(function(error) {
                    console.log("Ошибка воспроизведения:", error);
                });
            });
        }
        
        if ($pauseMusicBtn.length) {
            $pauseMusicBtn.on('click', function() {
                musicAudio.pause();
            });
        }
        
        if ($musicVolumeUp.length) {
            $musicVolumeUp.on('click', function() {
                if (musicAudio.volume < 1) {
                    musicAudio.volume = Math.min(1, musicAudio.volume + 0.1);
                }
            });
        }
        
        if ($musicVolumeDown.length) {
            $musicVolumeDown.on('click', function() {
                if (musicAudio.volume > 0) {
                    musicAudio.volume = Math.max(0, musicAudio.volume - 0.1);
                }
            });
        }
        
        // Обновление состояния кнопок
        $musicAudio.on('play', function() {
            $playMusicBtn.hide();
            $pauseMusicBtn.show();
        });
        
        $musicAudio.on('pause', function() {
            $playMusicBtn.show();
            $pauseMusicBtn.hide();
        });
        
        // Инициализация состояния кнопок
        $pauseMusicBtn.hide();
    }
}

// Инициализация формы обратной связи
function initForms() {
    const $feedbackForm = $('#feedbackForm');
    
    if ($feedbackForm.length) {
        // Добавляем анимацию фокуса для полей формы
        $feedbackForm.find('input, textarea, select').on('focus', function() {
            $(this).parent().addClass('focused');
        }).on('blur', function() {
            if (!$(this).val()) {
                $(this).parent().removeClass('focused');
            }
        });
        
        $feedbackForm.on('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения полей
            const name = $('#name').val().trim();
            const email = $('#email').val().trim();
            const interest = $('#interest').val();
            const message = $('#message').val().trim();
            
            // Валидация
            let isValid = true;
            let errorMessage = '';
            
            if (name.length < 2) {
                isValid = false;
                errorMessage = 'Имя должно содержать минимум 2 символа';
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            } else if (!interest) {
                isValid = false;
                errorMessage = 'Пожалуйста, выберите сферу интереса';
            } else if (message.length < 5) {
                isValid = false;
                errorMessage = 'Сообщение должно содержать минимум 5 символов';
            }
            
            // Если есть ошибка, показываем её
            if (!isValid) {
                showFormMessage(errorMessage, 'error');
                return;
            }
            
            // Симуляция отправки формы
            showFormMessage('Ваше сообщение отправляется...', 'info');
            
            // Имитация задержки отправки
            setTimeout(function() {
                // Сохраняем данные формы в localStorage
                const formData = {
                    name: name,
                    email: email,
                    interest: interest,
                    message: message,
                    date: new Date().toLocaleString('ru-RU')
                };
                
                let submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
                submissions.push(formData);
                localStorage.setItem('formSubmissions', JSON.stringify(submissions));
                
                // Показываем сообщение об успехе
                showFormMessage('Спасибо! Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.', 'success');
                
                // Сбрасываем форму
                $feedbackForm[0].reset();
                $feedbackForm.find('.form-group').removeClass('focused');
                
                // Скрываем сообщение через 7 секунд
                setTimeout(function() {
                    $('#formMessage').fadeOut(500);
                }, 7000);
            }, 1500);
        });
        
        // Валидация email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        // Показать сообщение формы
        function showFormMessage(message, type) {
            const $formMessage = $('#formMessage');
            if ($formMessage.length) {
                $formMessage
                    .removeClass('error success info')
                    .addClass(type)
                    .text(message)
                    .stop(true, true)
                    .fadeIn(300);
            }
        }
    }
}

// Отслеживание посещения сайта
function trackVisit() {
    let visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    
    if (lastVisitDate !== today) {
        visitCount++;
        localStorage.setItem('visitCount', visitCount.toString());
        localStorage.setItem('lastVisitDate', today);
        
        if (visitCount === 1) {
            localStorage.setItem('firstVisitDate', new Date().toISOString());
        }
    }
    
    localStorage.setItem('lastVisitTime', new Date().toISOString());
    
    // Для отладки
    if (visitCount === 1) {
        console.log('Добро пожаловать! Это ваше первое посещение сайта.');
    } else {
        console.log(`Добро пожаловать! Это ваше посещение №${visitCount}`);
    }
}

// Дополнительные jQuery эффекты и анимации
function initJQueryEffects() {
    // Плавное появление элементов при скролле
    $(window).on('scroll', checkVisibility);
    
    // Проверка видимости при загрузке
    checkVisibility();
    
    // Анимация при наведении на карточки
    $('.legacy-item, .style-card').hover(
        function() {
            $(this).css({
                'transform': 'translateY(-10px)',
                'box-shadow': '0 15px 30px rgba(0, 0, 0, 0.15)'
            });
        },
        function() {
            $(this).css({
                'transform': 'translateY(0)',
                'box-shadow': 'var(--shadow)'
            });
        }
    );
    
    // Анимация строк таблицы
    $('.representatives-table tbody tr').hover(
        function() {
            $(this).css('background-color', 'rgba(201, 169, 110, 0.2)');
        },
        function() {
            $(this).css('background-color', '');
        }
    );
    
    // Анимация иконок
    $('.legacy-icon').hover(
        function() {
            $(this).css({
                'transform': 'scale(1.2) rotate(5deg)',
                'color': 'var(--primary-dark)'
            });
        },
        function() {
            $(this).css({
                'transform': 'scale(1) rotate(0)',
                'color': 'var(--primary-color)'
            });
        }
    );
    
    // Анимация появления заголовков
    $('.section-title').each(function(index) {
        const $title = $(this);
        setTimeout(function() {
            $title.addClass('fade-in');
        }, index * 200);
    });
}

// Функция проверки видимости элементов
function checkVisibility() {
    const windowHeight = $(window).height();
    const windowTop = $(window).scrollTop();
    const windowBottom = windowTop + windowHeight;
    
    $('.section').each(function() {
        const $section = $(this);
        const sectionTop = $section.offset().top;
        const sectionBottom = sectionTop + $section.outerHeight();
        
        if (sectionBottom >= windowTop && sectionTop <= windowBottom) {
            $section.addClass('visible');
        }
    });
    
    // Показать/скрыть кнопку "Наверх"
    const $backToTop = $('#backToTop');
    if ($backToTop.length) {
        if (windowTop > 500) {
            $backToTop.addClass('visible');
        } else {
            $backToTop.removeClass('visible');
        }
    }
}

// Инициализация кнопки "Наверх"
function initBackToTopButton() {
    // Создаем кнопку
    $('body').append('<button id="backToTop" class="back-to-top" title="Наверх"><i class="fas fa-arrow-up"></i></button>');
    
    // Обработчик для кнопки
    $('#backToTop').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
    
    // Изначально скрываем кнопку
    $('#backToTop').hide();
    
    // Показать/скрыть при скролле
    $(window).on('scroll', function() {
        const scrollTop = $(window).scrollTop();
        const $backToTop = $('#backToTop');
        
        if (scrollTop > 500) {
            $backToTop.fadeIn(300);
        } else {
            $backToTop.fadeOut(300);
        }
    });
}

// Обработка изменения размера окна
$(window).on('resize', function() {
    // Перепроверка видимости
    checkVisibility();
    
    // Закрыть мобильное меню при увеличении окна
    if ($(window).width() > 768) {
        $('#navMenu').removeClass('active');
        $('#navToggle i').removeClass('fa-times').addClass('fa-bars');
    }
});