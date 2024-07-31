/*! For license information please see bundle.js.LICENSE.txt */
(() => {
  'use strict';
  var e = {};
  function t() {
    var e = n().get('data');
    return (
      null == e &&
        (console.log('default data file'), (e = 'zulu-lettersounds')),
      e
    );
  }
  function n() {
    const e = window.location.search;
    return new URLSearchParams(e);
  }
  e.g = (function () {
    if ('object' == typeof globalThis) return globalThis;
    try {
      return this || new Function('return this')();
    } catch (e) {
      if ('object' == typeof window) return window;
    }
  })();
  var i = function (e, t, n, i) {
    return new (n || (n = Promise))(function (s, a) {
      function r(e) {
        try {
          c(i.next(e));
        } catch (e) {
          a(e);
        }
      }
      function o(e) {
        try {
          c(i.throw(e));
        } catch (e) {
          a(e);
        }
      }
      function c(e) {
        var t;
        e.done
          ? s(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(r, o);
      }
      c((i = i.apply(e, t || [])).next());
    });
  };
  function s(e) {
    return '/data/' + e + '.json';
  }
  function a(e) {
    return i(this, void 0, void 0, function* () {
      var t = s(e);
      return fetch(t).then((e) => e.json());
    });
  }
  class r {
    constructor() {
      (this.imageToCache = []),
        (this.wavToCache = []),
        (this.allAudios = {}),
        (this.allImages = {}),
        (this.dataURL = ''),
        (this.correctSoundPath = 'dist/audio/Correct.wav'),
        (this.feedbackAudio = null),
        (this.correctAudio = null);
    }
    init() {
      (this.feedbackAudio = new Audio()),
        (this.feedbackAudio.src = this.correctSoundPath),
        (this.correctAudio = new Audio());
    }
    static PrepareAudioAndImagesForSurvey(e, t) {
      r.getInstance().dataURL = t;
      const n = 'audio/' + r.getInstance().dataURL + '/answer_feedback.mp3';
      for (var i in (r.getInstance().wavToCache.push(n),
      (r.getInstance().correctAudio.src = n),
      e)) {
        let t = e[i];
        for (var s in (null != t.promptAudio &&
          r.FilterAndAddAudioToAllAudios(t.promptAudio.toLowerCase()),
        null != t.promptImg && r.AddImageToAllImages(t.promptImg),
        t.answers)) {
          let e = t.answers[s];
          null != e.answerImg && r.AddImageToAllImages(e.answerImg);
        }
      }
      console.log(r.getInstance().allAudios),
        console.log(r.getInstance().allImages);
    }
    static AddImageToAllImages(e) {
      console.log('Add image: ' + e);
      let t = new Image();
      (t.src = e), (r.getInstance().allImages[e] = t);
    }
    static FilterAndAddAudioToAllAudios(e) {
      console.log('Adding audio: ' + e),
        e.includes('.wav')
          ? (e = e.replace('.wav', '.mp3'))
          : e.includes('.mp3') || (e = e.trim() + '.mp3'),
        console.log('Filtered: ' + e);
      let t = new Audio();
      ['luganda'].includes(r.getInstance().dataURL.split('-')[0]),
        (t.src = 'audio/' + r.getInstance().dataURL + '/' + e),
        (r.getInstance().allAudios[e] = t),
        console.log(t.src);
    }
    static PreloadBucket(e, t) {
      for (var n in ((r.getInstance().dataURL = t),
      (r.getInstance().correctAudio.src =
        'audio/' + r.getInstance().dataURL + '/answer_feedback.mp3'),
      e.items)) {
        var i = e.items[n];
        r.FilterAndAddAudioToAllAudios(i.itemName.toLowerCase());
      }
    }
    static PlayAudio(e, t, n) {
      (e = e.toLowerCase()),
        console.log('trying to play ' + e),
        e.includes('.mp3')
          ? '.mp3' != e.slice(-4) && (e = e.trim() + '.mp3')
          : (e = e.trim() + '.mp3'),
        console.log('Pre play all audios: '),
        console.log(r.getInstance().allAudios),
        new Promise((t, i) => {
          const s = r.getInstance().allAudios[e];
          s
            ? (s.addEventListener('play', () => {
                void 0 !== n && n(!0);
              }),
              s.addEventListener('ended', () => {
                void 0 !== n && n(!1), t();
              }),
              s.play().catch((e) => {
                console.error('Error playing audio:', e), t();
              }))
            : (console.warn('Audio file not found:', e), t());
        })
          .then(() => {
            void 0 !== t && t();
          })
          .catch((e) => {
            console.error('Promise error:', e);
          });
    }
    static GetImage(e) {
      return r.getInstance().allImages[e];
    }
    static PlayDing() {
      r.getInstance().feedbackAudio.play();
    }
    static PlayCorrect() {
      r.getInstance().correctAudio.play();
    }
    static getInstance() {
      return (
        null == r.instance && ((r.instance = new r()), r.instance.init()),
        r.instance
      );
    }
  }
  function o(e) {
    return e[Math.floor(Math.random() * e.length)];
  }
  function c(e) {
    for (let t = e.length - 1; t > 0; t--) {
      const n = Math.floor(Math.random() * (t + 1));
      [e[t], e[n]] = [e[n], e[t]];
    }
  }
  r.instance = null;
  class l {
    constructor() {
      (this.landingContainerId = 'landWrap'),
        (this.gameContainerId = 'gameWrap'),
        (this.endContainerId = 'endWrap'),
        (this.starContainerId = 'starWrapper'),
        (this.chestContainerId = 'chestWrapper'),
        (this.questionsContainerId = 'qWrap'),
        (this.feedbackContainerId = 'feedbackWrap'),
        (this.answersContainerId = 'aWrap'),
        (this.answerButton1Id = 'answerButton1'),
        (this.answerButton2Id = 'answerButton2'),
        (this.answerButton3Id = 'answerButton3'),
        (this.answerButton4Id = 'answerButton4'),
        (this.answerButton5Id = 'answerButton5'),
        (this.answerButton6Id = 'answerButton6'),
        (this.playButtonId = 'pbutton'),
        (this.chestImgId = 'chestImage'),
        (this.nextQuestion = null),
        (this.contentLoaded = !1),
        (this.shown = !1),
        (this.stars = []),
        (this.shownStarsCount = 0),
        (this.starPositions = Array()),
        (this.qAnsNum = 0),
        (this.buttons = []),
        (this.buttonsActive = !1),
        (this.devModeCorrectLabelVisibility = !1);
    }
    init() {
      (this.landingContainer = document.getElementById(
        this.landingContainerId
      )),
        (this.gameContainer = document.getElementById(this.gameContainerId)),
        (this.endContainer = document.getElementById(this.endContainerId)),
        (this.starContainer = document.getElementById(this.starContainerId)),
        (this.chestContainer = document.getElementById(this.chestContainerId)),
        (this.questionsContainer = document.getElementById(
          this.questionsContainerId
        )),
        (this.feedbackContainer = document.getElementById(
          this.feedbackContainerId
        )),
        (this.answersContainer = document.getElementById(
          this.answersContainerId
        )),
        (this.answerButton1 = document.getElementById(this.answerButton1Id)),
        (this.answerButton2 = document.getElementById(this.answerButton2Id)),
        (this.answerButton3 = document.getElementById(this.answerButton3Id)),
        (this.answerButton4 = document.getElementById(this.answerButton4Id)),
        (this.answerButton5 = document.getElementById(this.answerButton5Id)),
        (this.answerButton6 = document.getElementById(this.answerButton6Id)),
        (this.playButton = document.getElementById(this.playButtonId)),
        (this.chestImg = document.getElementById(this.chestImgId)),
        this.initializeStars(),
        this.initEventListeners();
    }
    initializeStars() {
      for (let e = 0; e < 20; e++) {
        const t = document.createElement('img');
        (t.id = 'star' + e),
          t.classList.add('topstarv'),
          this.starContainer.appendChild(t),
          (this.starContainer.innerHTML += ''),
          9 == e && (this.starContainer.innerHTML += '<br>'),
          this.stars.push(e);
      }
      c(this.stars);
    }
    SetCorrectLabelVisibility(e) {
      (this.devModeCorrectLabelVisibility = e),
        console.log(
          'Correct label visibility set to ',
          this.devModeCorrectLabelVisibility
        );
    }
    static OverlappingOtherStars(e, t, n, i) {
      if (e.length < 1) return !1;
      for (let s = 0; s < e.length; s++) {
        const a = e[s].x - t,
          r = e[s].y - n;
        if (Math.sqrt(a * a + r * r) < i) return !0;
      }
      return !1;
    }
    initEventListeners() {
      this.answerButton1.addEventListener('click', () => {
        this.answerButtonPress(1);
      }),
        this.buttons.push(this.answerButton1),
        this.answerButton2.addEventListener('click', () => {
          this.answerButtonPress(2);
        }),
        this.buttons.push(this.answerButton2),
        this.answerButton3.addEventListener('click', () => {
          this.answerButtonPress(3);
        }),
        this.buttons.push(this.answerButton3),
        this.answerButton4.addEventListener('click', () => {
          this.answerButtonPress(4);
        }),
        this.buttons.push(this.answerButton4),
        this.answerButton5.addEventListener('click', () => {
          this.answerButtonPress(5);
        }),
        this.buttons.push(this.answerButton5),
        this.answerButton6.addEventListener('click', () => {
          this.answerButtonPress(6);
        }),
        this.buttons.push(this.answerButton6),
        this.landingContainer.addEventListener('click', () => {
          localStorage.getItem(t()) && this.showGame();
        });
    }
    showOptions() {
      if (!l.getInstance().shown) {
        const e = l.getInstance().nextQuestion,
          t = l.getInstance().buttons;
        let n = 220;
        const i = 150;
        l.getInstance().shown = !0;
        let s = 0;
        t.forEach((e) => {
          (e.style.visibility = 'hidden'),
            (e.style.animation = ''),
            (e.innerHTML = '');
        }),
          setTimeout(() => {
            for (let i = 0; i < e.answers.length; i++) {
              const a = e.answers[i],
                o = t[i],
                c = a.answerName === e.correct;
              if (
                ((o.innerHTML = 'answerText' in a ? a.answerText : ''),
                c && l.getInstance().devModeCorrectLabelVisibility)
              ) {
                const e = document.createElement('div');
                e.classList.add('correct-label'),
                  (e.innerHTML = 'Correct'),
                  o.appendChild(e);
              }
              (o.style.visibility = 'hidden'),
                (o.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,0)'),
                setTimeout(
                  () => {
                    if (
                      ((o.style.visibility = 'visible'),
                      (o.style.boxShadow = '0px 6px 8px #606060'),
                      (o.style.animation = `zoomIn ${n}ms ease forwards`),
                      'answerImg' in a)
                    ) {
                      const e = r.GetImage(a.answerImg);
                      o.appendChild(e);
                    }
                    o.addEventListener('animationend', () => {
                      s++,
                        s === e.answers.length &&
                          l.getInstance().enableAnswerButton();
                    });
                  },
                  i * n * 0.3
                );
            }
          }, i),
          (l.getInstance().qStart = Date.now());
      }
    }
    enableAnswerButton() {
      l.getInstance().buttonsActive = !0;
    }
    static SetFeedbackText(e) {
      console.log('Feedback text set to ' + e),
        (l.getInstance().feedbackContainer.innerHTML = e);
    }
    showLanding() {
      (this.landingContainer.style.display = 'flex'),
        (this.gameContainer.style.display = 'none'),
        (this.endContainer.style.display = 'none');
    }
    static ShowEnd() {
      (l.getInstance().landingContainer.style.display = 'none'),
        (l.getInstance().gameContainer.style.display = 'none'),
        (l.getInstance().endContainer.style.display = 'flex');
    }
    showGame() {
      (this.landingContainer.style.display = 'none'),
        (this.gameContainer.style.display = 'grid'),
        (this.endContainer.style.display = 'none'),
        (this.allStart = Date.now()),
        this.startPressCallback();
    }
    static SetFeedbackVisibile(e) {
      e
        ? (l.getInstance().feedbackContainer.classList.remove('hidden'),
          l.getInstance().feedbackContainer.classList.add('visible'),
          r.PlayCorrect(),
          (l.getInstance().buttonsActive = !1))
        : (l.getInstance().feedbackContainer.classList.remove('visible'),
          l.getInstance().feedbackContainer.classList.add('hidden'),
          (l.getInstance().buttonsActive = !1));
    }
    static ReadyForNext(e) {
      if (null !== e) {
        for (var t in (console.log('ready for next!'),
        (l.getInstance().answersContainer.style.visibility = 'hidden'),
        l.getInstance().buttons))
          l.getInstance().buttons[t].style.visibility = 'hidden';
        (l.getInstance().shown = !1),
          (l.getInstance().nextQuestion = e),
          (l.getInstance().questionsContainer.innerHTML = ''),
          (l.getInstance().questionsContainer.style.display = 'none'),
          (l.getInstance().playButton.innerHTML =
            "<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='/img/SoundButton_Idle.png' type='image/svg+xml'> </img></button>"),
          document
            .getElementById('nextqButton')
            .addEventListener('click', function () {
              l.ShowQuestion(),
                r.PlayAudio(
                  e.promptAudio,
                  l.getInstance().showOptions,
                  l.ShowAudioAnimation
                );
            });
      }
    }
    static ShowAudioAnimation(e = !1) {
      l.getInstance().playButton.querySelector('img').src = e
        ? 'animation/SoundButton.gif'
        : '/img/SoundButton_Idle.png';
    }
    static ShowQuestion(e) {
      (l.getInstance().playButton.innerHTML =
        "<button id='nextqButton'><img class=audio-button width='100px' height='100px' src='/img/SoundButton_Idle.png' type='image/svg+xml'> </img></button>"),
        document
          .getElementById('nextqButton')
          .addEventListener('click', function () {
            console.log('next question button pressed'),
              console.log(e.promptAudio),
              'promptAudio' in e &&
                r.PlayAudio(e.promptAudio, void 0, l.ShowAudioAnimation);
          }),
        (l.getInstance().answersContainer.style.visibility = 'visible');
      let t = '';
      if (
        ((l.getInstance().questionsContainer.innerHTML = ''),
        void 0 === e && (e = l.getInstance().nextQuestion),
        'promptImg' in e)
      ) {
        var n = r.GetImage(e.promptImg);
        l.getInstance().questionsContainer.appendChild(n);
      }
      for (var i in ((t += e.promptText),
      (t += '<BR>'),
      (l.getInstance().questionsContainer.innerHTML += t),
      l.getInstance().buttons))
        l.getInstance().buttons[i].style.visibility = 'hidden';
    }
    static AddStar() {
      var e = document.getElementById(
        'star' + l.getInstance().stars[l.getInstance().qAnsNum]
      );
      (e.src = '../animation/Star.gif'),
        e.classList.add('topstarv'),
        e.classList.remove('topstarh'),
        (e.style.position = 'absolute');
      let t = l.instance.starContainer.offsetWidth,
        n = l.instance.starContainer.offsetHeight;
      console.log('Stars Container dimensions: ', t, n);
      let i = 0,
        s = 0;
      do {
        (i = Math.floor(Math.random() * (t - 60))),
          (s = Math.floor(Math.random() * n));
      } while (l.OverlappingOtherStars(l.instance.starPositions, i, s, 30));
      (e.style.transform = 'scale(10)'),
        (e.style.transition = 'top 1s ease, left 1s ease, transform 0.5s ease'),
        (e.style.zIndex = '500'),
        (e.style.top = window.innerHeight / 2 + 'px'),
        (e.style.left =
          l.instance.gameContainer.offsetWidth / 2 - e.offsetWidth / 2 + 'px'),
        setTimeout(() => {
          if (
            ((e.style.transition =
              'top 2s ease, left 2s ease, transform 2s ease'),
            i < t / 2)
          ) {
            const t = 5 + 8 * Math.random();
            console.log('Rotating star to the right', t),
              (e.style.transform = 'rotate(-' + t + 'deg) scale(1)');
          } else {
            const t = 5 + 8 * Math.random();
            console.log('Rotating star to the left', t),
              (e.style.transform = 'rotate(' + t + 'deg) scale(1)');
          }
          (e.style.left = 20 + i + 'px'),
            (e.style.top = 20 + s + 'px'),
            setTimeout(() => {
              e.style.filter = 'drop-shadow(0px 0px 10px yellow)';
            }, 1900);
        }, 1e3),
        l.instance.starPositions.push({ x: i, y: s }),
        (l.getInstance().qAnsNum += 1),
        (l.getInstance().shownStarsCount += 1);
    }
    static ChangeStarImageAfterAnimation() {
      document.getElementById(
        'star' + l.getInstance().stars[l.getInstance().qAnsNum - 1]
      ).src = '../img/star_after_animation.gif';
    }
    answerButtonPress(e) {
      const t = this.buttons.every((e) => 'visible' === e.style.visibility);
      if ((console.log(this.buttonsActive, t), !0 === this.buttonsActive)) {
        r.PlayDing();
        const t = Date.now() - this.qStart;
        console.log('answered in ' + t), this.buttonPressCallback(e, t);
      }
    }
    static ProgressChest() {
      const e = document.getElementById('chestImage');
      let t = e.src;
      console.log('Chest Progression--\x3e', e),
        console.log('Chest Progression--\x3e', e.src);
      const n = parseInt(t.slice(-6, -4), 10);
      console.log('Chest Progression number--\x3e', n);
      const i = `img/chestprogression/TreasureChestOpen0${(n % 4) + 1}.svg`;
      e.src = i;
    }
    static SetContentLoaded(e) {
      l.getInstance().contentLoaded = e;
    }
    static SetButtonPressAction(e) {
      l.getInstance().buttonPressCallback = e;
    }
    static SetStartAction(e) {
      l.getInstance().startPressCallback = e;
    }
    static getInstance() {
      return (
        null === l.instance && ((l.instance = new l()), l.instance.init()),
        l.instance
      );
    }
  }
  l.instance = null;
  const u = function (e) {
      const t = [];
      let n = 0;
      for (let i = 0; i < e.length; i++) {
        let s = e.charCodeAt(i);
        s < 128
          ? (t[n++] = s)
          : s < 2048
            ? ((t[n++] = (s >> 6) | 192), (t[n++] = (63 & s) | 128))
            : 55296 == (64512 & s) &&
                i + 1 < e.length &&
                56320 == (64512 & e.charCodeAt(i + 1))
              ? ((s = 65536 + ((1023 & s) << 10) + (1023 & e.charCodeAt(++i))),
                (t[n++] = (s >> 18) | 240),
                (t[n++] = ((s >> 12) & 63) | 128),
                (t[n++] = ((s >> 6) & 63) | 128),
                (t[n++] = (63 & s) | 128))
              : ((t[n++] = (s >> 12) | 224),
                (t[n++] = ((s >> 6) & 63) | 128),
                (t[n++] = (63 & s) | 128));
      }
      return t;
    },
    d = {
      byteToCharMap_: null,
      charToByteMap_: null,
      byteToCharMapWebSafe_: null,
      charToByteMapWebSafe_: null,
      ENCODED_VALS_BASE:
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + '+/=';
      },
      get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + '-_.';
      },
      HAS_NATIVE_SUPPORT: 'function' == typeof atob,
      encodeByteArray(e, t) {
        if (!Array.isArray(e))
          throw Error('encodeByteArray takes an array as a parameter');
        this.init_();
        const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
          i = [];
        for (let t = 0; t < e.length; t += 3) {
          const s = e[t],
            a = t + 1 < e.length,
            r = a ? e[t + 1] : 0,
            o = t + 2 < e.length,
            c = o ? e[t + 2] : 0,
            l = s >> 2,
            u = ((3 & s) << 4) | (r >> 4);
          let d = ((15 & r) << 2) | (c >> 6),
            h = 63 & c;
          o || ((h = 64), a || (d = 64)), i.push(n[l], n[u], n[d], n[h]);
        }
        return i.join('');
      },
      encodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? btoa(e)
          : this.encodeByteArray(u(e), t);
      },
      decodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? atob(e)
          : (function (e) {
              const t = [];
              let n = 0,
                i = 0;
              for (; n < e.length; ) {
                const s = e[n++];
                if (s < 128) t[i++] = String.fromCharCode(s);
                else if (s > 191 && s < 224) {
                  const a = e[n++];
                  t[i++] = String.fromCharCode(((31 & s) << 6) | (63 & a));
                } else if (s > 239 && s < 365) {
                  const a =
                    (((7 & s) << 18) |
                      ((63 & e[n++]) << 12) |
                      ((63 & e[n++]) << 6) |
                      (63 & e[n++])) -
                    65536;
                  (t[i++] = String.fromCharCode(55296 + (a >> 10))),
                    (t[i++] = String.fromCharCode(56320 + (1023 & a)));
                } else {
                  const a = e[n++],
                    r = e[n++];
                  t[i++] = String.fromCharCode(
                    ((15 & s) << 12) | ((63 & a) << 6) | (63 & r)
                  );
                }
              }
              return t.join('');
            })(this.decodeStringToByteArray(e, t));
      },
      decodeStringToByteArray(e, t) {
        this.init_();
        const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
          i = [];
        for (let t = 0; t < e.length; ) {
          const s = n[e.charAt(t++)],
            a = t < e.length ? n[e.charAt(t)] : 0;
          ++t;
          const r = t < e.length ? n[e.charAt(t)] : 64;
          ++t;
          const o = t < e.length ? n[e.charAt(t)] : 64;
          if ((++t, null == s || null == a || null == r || null == o))
            throw Error();
          const c = (s << 2) | (a >> 4);
          if ((i.push(c), 64 !== r)) {
            const e = ((a << 4) & 240) | (r >> 2);
            if ((i.push(e), 64 !== o)) {
              const e = ((r << 6) & 192) | o;
              i.push(e);
            }
          }
        }
        return i;
      },
      init_() {
        if (!this.byteToCharMap_) {
          (this.byteToCharMap_ = {}),
            (this.charToByteMap_ = {}),
            (this.byteToCharMapWebSafe_ = {}),
            (this.charToByteMapWebSafe_ = {});
          for (let e = 0; e < this.ENCODED_VALS.length; e++)
            (this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
              (this.charToByteMap_[this.byteToCharMap_[e]] = e),
              (this.byteToCharMapWebSafe_[e] =
                this.ENCODED_VALS_WEBSAFE.charAt(e)),
              (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e),
              e >= this.ENCODED_VALS_BASE.length &&
                ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
                (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e));
        }
      },
    },
    h = function (e) {
      return (function (e) {
        const t = u(e);
        return d.encodeByteArray(t, !0);
      })(e).replace(/\./g, '');
    };
  function g() {
    return 'object' == typeof indexedDB;
  }
  function p() {
    return new Promise((e, t) => {
      try {
        let n = !0;
        const i = 'validate-browser-context-for-indexeddb-analytics-module',
          s = self.indexedDB.open(i);
        (s.onsuccess = () => {
          s.result.close(), n || self.indexedDB.deleteDatabase(i), e(!0);
        }),
          (s.onupgradeneeded = () => {
            n = !1;
          }),
          (s.onerror = () => {
            var e;
            t(
              (null === (e = s.error) || void 0 === e ? void 0 : e.message) ||
                ''
            );
          });
      } catch (e) {
        t(e);
      }
    });
  }
  const f = () => {
    try {
      return (
        (function () {
          if ('undefined' != typeof self) return self;
          if ('undefined' != typeof window) return window;
          if (void 0 !== e.g) return e.g;
          throw new Error('Unable to locate global object.');
        })().__FIREBASE_DEFAULTS__ ||
        (() => {
          if ('undefined' == typeof process || void 0 === process.env) return;
          const e = process.env.__FIREBASE_DEFAULTS__;
          return e ? JSON.parse(e) : void 0;
        })() ||
        (() => {
          if ('undefined' == typeof document) return;
          let e;
          try {
            e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
          } catch (e) {
            return;
          }
          const t =
            e &&
            (function (e) {
              try {
                return d.decodeString(e, !0);
              } catch (e) {
                console.error('base64Decode failed: ', e);
              }
              return null;
            })(e[1]);
          return t && JSON.parse(t);
        })()
      );
    } catch (e) {
      return void console.info(
        `Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`
      );
    }
  };
  class m {
    constructor() {
      (this.reject = () => {}),
        (this.resolve = () => {}),
        (this.promise = new Promise((e, t) => {
          (this.resolve = e), (this.reject = t);
        }));
    }
    wrapCallback(e) {
      return (t, n) => {
        t ? this.reject(t) : this.resolve(n),
          'function' == typeof e &&
            (this.promise.catch(() => {}), 1 === e.length ? e(t) : e(t, n));
      };
    }
  }
  class b extends Error {
    constructor(e, t, n) {
      super(t),
        (this.code = e),
        (this.customData = n),
        (this.name = 'FirebaseError'),
        Object.setPrototypeOf(this, b.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, w.prototype.create);
    }
  }
  class w {
    constructor(e, t, n) {
      (this.service = e), (this.serviceName = t), (this.errors = n);
    }
    create(e, ...t) {
      const n = t[0] || {},
        i = `${this.service}/${e}`,
        s = this.errors[e],
        a = s
          ? (function (e, t) {
              return e.replace(v, (e, n) => {
                const i = t[n];
                return null != i ? String(i) : `<${n}?>`;
              });
            })(s, n)
          : 'Error',
        r = `${this.serviceName}: ${a} (${i}).`;
      return new b(i, r, n);
    }
  }
  const v = /\{\$([^}]+)}/g;
  function y(e, t) {
    if (e === t) return !0;
    const n = Object.keys(e),
      i = Object.keys(t);
    for (const s of n) {
      if (!i.includes(s)) return !1;
      const n = e[s],
        a = t[s];
      if (I(n) && I(a)) {
        if (!y(n, a)) return !1;
      } else if (n !== a) return !1;
    }
    for (const e of i) if (!n.includes(e)) return !1;
    return !0;
  }
  function I(e) {
    return null !== e && 'object' == typeof e;
  }
  function k(e, t = 1e3, n = 2) {
    const i = t * Math.pow(n, e),
      s = Math.round(0.5 * i * (Math.random() - 0.5) * 2);
    return Math.min(144e5, i + s);
  }
  function B(e) {
    return e && e._delegate ? e._delegate : e;
  }
  class S {
    constructor(e, t, n) {
      (this.name = e),
        (this.instanceFactory = t),
        (this.type = n),
        (this.multipleInstances = !1),
        (this.serviceProps = {}),
        (this.instantiationMode = 'LAZY'),
        (this.onInstanceCreated = null);
    }
    setInstantiationMode(e) {
      return (this.instantiationMode = e), this;
    }
    setMultipleInstances(e) {
      return (this.multipleInstances = e), this;
    }
    setServiceProps(e) {
      return (this.serviceProps = e), this;
    }
    setInstanceCreatedCallback(e) {
      return (this.onInstanceCreated = e), this;
    }
  }
  const C = '[DEFAULT]';
  class L {
    constructor(e, t) {
      (this.name = e),
        (this.container = t),
        (this.component = null),
        (this.instances = new Map()),
        (this.instancesDeferred = new Map()),
        (this.instancesOptions = new Map()),
        (this.onInitCallbacks = new Map());
    }
    get(e) {
      const t = this.normalizeInstanceIdentifier(e);
      if (!this.instancesDeferred.has(t)) {
        const e = new m();
        if (
          (this.instancesDeferred.set(t, e),
          this.isInitialized(t) || this.shouldAutoInitialize())
        )
          try {
            const n = this.getOrInitializeService({ instanceIdentifier: t });
            n && e.resolve(n);
          } catch (e) {}
      }
      return this.instancesDeferred.get(t).promise;
    }
    getImmediate(e) {
      var t;
      const n = this.normalizeInstanceIdentifier(
          null == e ? void 0 : e.identifier
        ),
        i = null !== (t = null == e ? void 0 : e.optional) && void 0 !== t && t;
      if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
        if (i) return null;
        throw Error(`Service ${this.name} is not available`);
      }
      try {
        return this.getOrInitializeService({ instanceIdentifier: n });
      } catch (e) {
        if (i) return null;
        throw e;
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(e) {
      if (e.name !== this.name)
        throw Error(
          `Mismatching Component ${e.name} for Provider ${this.name}.`
        );
      if (this.component)
        throw Error(`Component for ${this.name} has already been provided`);
      if (((this.component = e), this.shouldAutoInitialize())) {
        if (
          (function (e) {
            return 'EAGER' === e.instantiationMode;
          })(e)
        )
          try {
            this.getOrInitializeService({ instanceIdentifier: C });
          } catch (e) {}
        for (const [e, t] of this.instancesDeferred.entries()) {
          const n = this.normalizeInstanceIdentifier(e);
          try {
            const e = this.getOrInitializeService({ instanceIdentifier: n });
            t.resolve(e);
          } catch (e) {}
        }
      }
    }
    clearInstance(e = '[DEFAULT]') {
      this.instancesDeferred.delete(e),
        this.instancesOptions.delete(e),
        this.instances.delete(e);
    }
    async delete() {
      const e = Array.from(this.instances.values());
      await Promise.all([
        ...e.filter((e) => 'INTERNAL' in e).map((e) => e.INTERNAL.delete()),
        ...e.filter((e) => '_delete' in e).map((e) => e._delete()),
      ]);
    }
    isComponentSet() {
      return null != this.component;
    }
    isInitialized(e = '[DEFAULT]') {
      return this.instances.has(e);
    }
    getOptions(e = '[DEFAULT]') {
      return this.instancesOptions.get(e) || {};
    }
    initialize(e = {}) {
      const { options: t = {} } = e,
        n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
      if (this.isInitialized(n))
        throw Error(`${this.name}(${n}) has already been initialized`);
      if (!this.isComponentSet())
        throw Error(`Component ${this.name} has not been registered yet`);
      const i = this.getOrInitializeService({
        instanceIdentifier: n,
        options: t,
      });
      for (const [e, t] of this.instancesDeferred.entries())
        n === this.normalizeInstanceIdentifier(e) && t.resolve(i);
      return i;
    }
    onInit(e, t) {
      var n;
      const i = this.normalizeInstanceIdentifier(t),
        s =
          null !== (n = this.onInitCallbacks.get(i)) && void 0 !== n
            ? n
            : new Set();
      s.add(e), this.onInitCallbacks.set(i, s);
      const a = this.instances.get(i);
      return (
        a && e(a, i),
        () => {
          s.delete(e);
        }
      );
    }
    invokeOnInitCallbacks(e, t) {
      const n = this.onInitCallbacks.get(t);
      if (n)
        for (const i of n)
          try {
            i(e, t);
          } catch (e) {}
    }
    getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
      let n = this.instances.get(e);
      if (
        !n &&
        this.component &&
        ((n = this.component.instanceFactory(this.container, {
          instanceIdentifier: ((i = e), i === C ? void 0 : i),
          options: t,
        })),
        this.instances.set(e, n),
        this.instancesOptions.set(e, t),
        this.invokeOnInitCallbacks(n, e),
        this.component.onInstanceCreated)
      )
        try {
          this.component.onInstanceCreated(this.container, e, n);
        } catch (e) {}
      var i;
      return n || null;
    }
    normalizeInstanceIdentifier(e = '[DEFAULT]') {
      return this.component ? (this.component.multipleInstances ? e : C) : e;
    }
    shouldAutoInitialize() {
      return (
        !!this.component && 'EXPLICIT' !== this.component.instantiationMode
      );
    }
  }
  class A {
    constructor(e) {
      (this.name = e), (this.providers = new Map());
    }
    addComponent(e) {
      const t = this.getProvider(e.name);
      if (t.isComponentSet())
        throw new Error(
          `Component ${e.name} has already been registered with ${this.name}`
        );
      t.setComponent(e);
    }
    addOrOverwriteComponent(e) {
      this.getProvider(e.name).isComponentSet() &&
        this.providers.delete(e.name),
        this.addComponent(e);
    }
    getProvider(e) {
      if (this.providers.has(e)) return this.providers.get(e);
      const t = new L(e, this);
      return this.providers.set(e, t), t;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  }
  const T = [];
  var E;
  !(function (e) {
    (e[(e.DEBUG = 0)] = 'DEBUG'),
      (e[(e.VERBOSE = 1)] = 'VERBOSE'),
      (e[(e.INFO = 2)] = 'INFO'),
      (e[(e.WARN = 3)] = 'WARN'),
      (e[(e.ERROR = 4)] = 'ERROR'),
      (e[(e.SILENT = 5)] = 'SILENT');
  })(E || (E = {}));
  const M = {
      debug: E.DEBUG,
      verbose: E.VERBOSE,
      info: E.INFO,
      warn: E.WARN,
      error: E.ERROR,
      silent: E.SILENT,
    },
    D = E.INFO,
    x = {
      [E.DEBUG]: 'log',
      [E.VERBOSE]: 'log',
      [E.INFO]: 'info',
      [E.WARN]: 'warn',
      [E.ERROR]: 'error',
    },
    R = (e, t, ...n) => {
      if (t < e.logLevel) return;
      const i = new Date().toISOString(),
        s = x[t];
      if (!s)
        throw new Error(
          `Attempted to log a message with an invalid logType (value: ${t})`
        );
      console[s](`[${i}]  ${e.name}:`, ...n);
    };
  class N {
    constructor(e) {
      (this.name = e),
        (this._logLevel = D),
        (this._logHandler = R),
        (this._userLogHandler = null),
        T.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(e) {
      if (!(e in E))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
      this._logLevel = e;
    }
    setLogLevel(e) {
      this._logLevel = 'string' == typeof e ? M[e] : e;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(e) {
      if ('function' != typeof e)
        throw new TypeError(
          'Value assigned to `logHandler` must be a function'
        );
      this._logHandler = e;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(e) {
      this._userLogHandler = e;
    }
    debug(...e) {
      this._userLogHandler && this._userLogHandler(this, E.DEBUG, ...e),
        this._logHandler(this, E.DEBUG, ...e);
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, E.VERBOSE, ...e),
        this._logHandler(this, E.VERBOSE, ...e);
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, E.INFO, ...e),
        this._logHandler(this, E.INFO, ...e);
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, E.WARN, ...e),
        this._logHandler(this, E.WARN, ...e);
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, E.ERROR, ...e),
        this._logHandler(this, E.ERROR, ...e);
    }
  }
  let P, U;
  const F = new WeakMap(),
    O = new WeakMap(),
    j = new WeakMap(),
    V = new WeakMap(),
    $ = new WeakMap();
  let q = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ('done' === t) return O.get(e);
        if ('objectStoreNames' === t) return e.objectStoreNames || j.get(e);
        if ('store' === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return W(e[t]);
    },
    set: (e, t, n) => ((e[t] = n), !0),
    has: (e, t) =>
      (e instanceof IDBTransaction && ('done' === t || 'store' === t)) ||
      t in e,
  };
  function H(e) {
    return 'function' == typeof e
      ? (t = e) !== IDBDatabase.prototype.transaction ||
        'objectStoreNames' in IDBTransaction.prototype
        ? (
            U ||
            (U = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(t)
          ? function (...e) {
              return t.apply(G(this), e), W(F.get(this));
            }
          : function (...e) {
              return W(t.apply(G(this), e));
            }
        : function (e, ...n) {
            const i = t.call(G(this), e, ...n);
            return j.set(i, e.sort ? e.sort() : [e]), W(i);
          }
      : (e instanceof IDBTransaction &&
          (function (e) {
            if (O.has(e)) return;
            const t = new Promise((t, n) => {
              const i = () => {
                  e.removeEventListener('complete', s),
                    e.removeEventListener('error', a),
                    e.removeEventListener('abort', a);
                },
                s = () => {
                  t(), i();
                },
                a = () => {
                  n(e.error || new DOMException('AbortError', 'AbortError')),
                    i();
                };
              e.addEventListener('complete', s),
                e.addEventListener('error', a),
                e.addEventListener('abort', a);
            });
            O.set(e, t);
          })(e),
        (n = e),
        (
          P ||
          (P = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
          ])
        ).some((e) => n instanceof e)
          ? new Proxy(e, q)
          : e);
    var t, n;
  }
  function W(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const i = () => {
              e.removeEventListener('success', s),
                e.removeEventListener('error', a);
            },
            s = () => {
              t(W(e.result)), i();
            },
            a = () => {
              n(e.error), i();
            };
          e.addEventListener('success', s), e.addEventListener('error', a);
        });
        return (
          t
            .then((t) => {
              t instanceof IDBCursor && F.set(t, e);
            })
            .catch(() => {}),
          $.set(t, e),
          t
        );
      })(e);
    if (V.has(e)) return V.get(e);
    const t = H(e);
    return t !== e && (V.set(e, t), $.set(t, e)), t;
  }
  const G = (e) => $.get(e);
  function z(
    e,
    t,
    { blocked: n, upgrade: i, blocking: s, terminated: a } = {}
  ) {
    const r = indexedDB.open(e, t),
      o = W(r);
    return (
      i &&
        r.addEventListener('upgradeneeded', (e) => {
          i(W(r.result), e.oldVersion, e.newVersion, W(r.transaction));
        }),
      n && r.addEventListener('blocked', () => n()),
      o
        .then((e) => {
          a && e.addEventListener('close', () => a()),
            s && e.addEventListener('versionchange', () => s());
        })
        .catch(() => {}),
      o
    );
  }
  const Q = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
    K = ['put', 'add', 'delete', 'clear'],
    J = new Map();
  function X(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || 'string' != typeof t) return;
    if (J.get(t)) return J.get(t);
    const n = t.replace(/FromIndex$/, ''),
      i = t !== n,
      s = K.includes(n);
    if (
      !(n in (i ? IDBIndex : IDBObjectStore).prototype) ||
      (!s && !Q.includes(n))
    )
      return;
    const a = async function (e, ...t) {
      const a = this.transaction(e, s ? 'readwrite' : 'readonly');
      let r = a.store;
      return (
        i && (r = r.index(t.shift())),
        (await Promise.all([r[n](...t), s && a.done]))[0]
      );
    };
    return J.set(t, a), a;
  }
  var Y;
  (Y = q),
    (q = {
      ...Y,
      get: (e, t, n) => X(e, t) || Y.get(e, t, n),
      has: (e, t) => !!X(e, t) || Y.has(e, t),
    });
  class Z {
    constructor(e) {
      this.container = e;
    }
    getPlatformInfoString() {
      return this.container
        .getProviders()
        .map((e) => {
          if (
            (function (e) {
              const t = e.getComponent();
              return 'VERSION' === (null == t ? void 0 : t.type);
            })(e)
          ) {
            const t = e.getImmediate();
            return `${t.library}/${t.version}`;
          }
          return null;
        })
        .filter((e) => e)
        .join(' ');
    }
  }
  const ee = '@firebase/app',
    te = '0.8.2',
    ne = new N('@firebase/app'),
    ie = '[DEFAULT]',
    se = {
      [ee]: 'fire-core',
      '@firebase/app-compat': 'fire-core-compat',
      '@firebase/analytics': 'fire-analytics',
      '@firebase/analytics-compat': 'fire-analytics-compat',
      '@firebase/app-check': 'fire-app-check',
      '@firebase/app-check-compat': 'fire-app-check-compat',
      '@firebase/auth': 'fire-auth',
      '@firebase/auth-compat': 'fire-auth-compat',
      '@firebase/database': 'fire-rtdb',
      '@firebase/database-compat': 'fire-rtdb-compat',
      '@firebase/functions': 'fire-fn',
      '@firebase/functions-compat': 'fire-fn-compat',
      '@firebase/installations': 'fire-iid',
      '@firebase/installations-compat': 'fire-iid-compat',
      '@firebase/messaging': 'fire-fcm',
      '@firebase/messaging-compat': 'fire-fcm-compat',
      '@firebase/performance': 'fire-perf',
      '@firebase/performance-compat': 'fire-perf-compat',
      '@firebase/remote-config': 'fire-rc',
      '@firebase/remote-config-compat': 'fire-rc-compat',
      '@firebase/storage': 'fire-gcs',
      '@firebase/storage-compat': 'fire-gcs-compat',
      '@firebase/firestore': 'fire-fst',
      '@firebase/firestore-compat': 'fire-fst-compat',
      'fire-js': 'fire-js',
      firebase: 'fire-js-all',
    },
    ae = new Map(),
    re = new Map();
  function oe(e, t) {
    try {
      e.container.addComponent(t);
    } catch (n) {
      ne.debug(
        `Component ${t.name} failed to register with FirebaseApp ${e.name}`,
        n
      );
    }
  }
  function ce(e) {
    const t = e.name;
    if (re.has(t))
      return (
        ne.debug(`There were multiple attempts to register component ${t}.`), !1
      );
    re.set(t, e);
    for (const t of ae.values()) oe(t, e);
    return !0;
  }
  function le(e, t) {
    const n = e.container
      .getProvider('heartbeat')
      .getImmediate({ optional: !0 });
    return n && n.triggerHeartbeat(), e.container.getProvider(t);
  }
  const ue = new w('app', 'Firebase', {
    'no-app':
      "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
    'bad-app-name': "Illegal App name: '{$appName}",
    'duplicate-app':
      "Firebase App named '{$appName}' already exists with different options or config",
    'app-deleted': "Firebase App named '{$appName}' already deleted",
    'no-options':
      'Need to provide options, when not being deployed to hosting via source.',
    'invalid-app-argument':
      'firebase.{$appName}() takes either no argument or a Firebase App instance.',
    'invalid-log-argument':
      'First argument to `onLog` must be null or a function.',
    'idb-open':
      'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-get':
      'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-set':
      'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-delete':
      'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.',
  });
  class de {
    constructor(e, t, n) {
      (this._isDeleted = !1),
        (this._options = Object.assign({}, e)),
        (this._config = Object.assign({}, t)),
        (this._name = t.name),
        (this._automaticDataCollectionEnabled =
          t.automaticDataCollectionEnabled),
        (this._container = n),
        this.container.addComponent(new S('app', () => this, 'PUBLIC'));
    }
    get automaticDataCollectionEnabled() {
      return this.checkDestroyed(), this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(e) {
      this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
    }
    get name() {
      return this.checkDestroyed(), this._name;
    }
    get options() {
      return this.checkDestroyed(), this._options;
    }
    get config() {
      return this.checkDestroyed(), this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(e) {
      this._isDeleted = e;
    }
    checkDestroyed() {
      if (this.isDeleted)
        throw ue.create('app-deleted', { appName: this._name });
    }
  }
  function he(e, t = {}) {
    let n = e;
    'object' != typeof t && (t = { name: t });
    const i = Object.assign(
        { name: ie, automaticDataCollectionEnabled: !1 },
        t
      ),
      s = i.name;
    if ('string' != typeof s || !s)
      throw ue.create('bad-app-name', { appName: String(s) });
    var a;
    if ((n || (n = null === (a = f()) || void 0 === a ? void 0 : a.config), !n))
      throw ue.create('no-options');
    const r = ae.get(s);
    if (r) {
      if (y(n, r.options) && y(i, r.config)) return r;
      throw ue.create('duplicate-app', { appName: s });
    }
    const o = new A(s);
    for (const e of re.values()) o.addComponent(e);
    const c = new de(n, i, o);
    return ae.set(s, c), c;
  }
  function ge(e, t, n) {
    var i;
    let s = null !== (i = se[e]) && void 0 !== i ? i : e;
    n && (s += `-${n}`);
    const a = s.match(/\s|\//),
      r = t.match(/\s|\//);
    if (a || r) {
      const e = [`Unable to register library "${s}" with version "${t}":`];
      return (
        a &&
          e.push(
            `library name "${s}" contains illegal characters (whitespace or "/")`
          ),
        a && r && e.push('and'),
        r &&
          e.push(
            `version name "${t}" contains illegal characters (whitespace or "/")`
          ),
        void ne.warn(e.join(' '))
      );
    }
    ce(new S(`${s}-version`, () => ({ library: s, version: t }), 'VERSION'));
  }
  const pe = 'firebase-heartbeat-store';
  let fe = null;
  function me() {
    return (
      fe ||
        (fe = z('firebase-heartbeat-database', 1, {
          upgrade: (e, t) => {
            0 === t && e.createObjectStore(pe);
          },
        }).catch((e) => {
          throw ue.create('idb-open', { originalErrorMessage: e.message });
        })),
      fe
    );
  }
  async function be(e, t) {
    var n;
    try {
      const n = (await me()).transaction(pe, 'readwrite'),
        i = n.objectStore(pe);
      return await i.put(t, we(e)), n.done;
    } catch (e) {
      if (e instanceof b) ne.warn(e.message);
      else {
        const t = ue.create('idb-set', {
          originalErrorMessage:
            null === (n = e) || void 0 === n ? void 0 : n.message,
        });
        ne.warn(t.message);
      }
    }
  }
  function we(e) {
    return `${e.name}!${e.options.appId}`;
  }
  class ve {
    constructor(e) {
      (this.container = e), (this._heartbeatsCache = null);
      const t = this.container.getProvider('app').getImmediate();
      (this._storage = new Ie(t)),
        (this._heartbeatsCachePromise = this._storage
          .read()
          .then((e) => ((this._heartbeatsCache = e), e)));
    }
    async triggerHeartbeat() {
      const e = this.container
          .getProvider('platform-logger')
          .getImmediate()
          .getPlatformInfoString(),
        t = ye();
      if (
        (null === this._heartbeatsCache &&
          (this._heartbeatsCache = await this._heartbeatsCachePromise),
        this._heartbeatsCache.lastSentHeartbeatDate !== t &&
          !this._heartbeatsCache.heartbeats.some((e) => e.date === t))
      )
        return (
          this._heartbeatsCache.heartbeats.push({ date: t, agent: e }),
          (this._heartbeatsCache.heartbeats =
            this._heartbeatsCache.heartbeats.filter((e) => {
              const t = new Date(e.date).valueOf();
              return Date.now() - t <= 2592e6;
            })),
          this._storage.overwrite(this._heartbeatsCache)
        );
    }
    async getHeartbeatsHeader() {
      if (
        (null === this._heartbeatsCache && (await this._heartbeatsCachePromise),
        null === this._heartbeatsCache ||
          0 === this._heartbeatsCache.heartbeats.length)
      )
        return '';
      const e = ye(),
        { heartbeatsToSend: t, unsentEntries: n } = (function (e, t = 1024) {
          const n = [];
          let i = e.slice();
          for (const s of e) {
            const e = n.find((e) => e.agent === s.agent);
            if (e) {
              if ((e.dates.push(s.date), ke(n) > t)) {
                e.dates.pop();
                break;
              }
            } else if (
              (n.push({ agent: s.agent, dates: [s.date] }), ke(n) > t)
            ) {
              n.pop();
              break;
            }
            i = i.slice(1);
          }
          return { heartbeatsToSend: n, unsentEntries: i };
        })(this._heartbeatsCache.heartbeats),
        i = h(JSON.stringify({ version: 2, heartbeats: t }));
      return (
        (this._heartbeatsCache.lastSentHeartbeatDate = e),
        n.length > 0
          ? ((this._heartbeatsCache.heartbeats = n),
            await this._storage.overwrite(this._heartbeatsCache))
          : ((this._heartbeatsCache.heartbeats = []),
            this._storage.overwrite(this._heartbeatsCache)),
        i
      );
    }
  }
  function ye() {
    return new Date().toISOString().substring(0, 10);
  }
  class Ie {
    constructor(e) {
      (this.app = e),
        (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck());
    }
    async runIndexedDBEnvironmentCheck() {
      return (
        !!g() &&
        p()
          .then(() => !0)
          .catch(() => !1)
      );
    }
    async read() {
      if (await this._canUseIndexedDBPromise) {
        const e = await (async function (e) {
          var t;
          try {
            return (await me()).transaction(pe).objectStore(pe).get(we(e));
          } catch (e) {
            if (e instanceof b) ne.warn(e.message);
            else {
              const n = ue.create('idb-get', {
                originalErrorMessage:
                  null === (t = e) || void 0 === t ? void 0 : t.message,
              });
              ne.warn(n.message);
            }
          }
        })(this.app);
        return e || { heartbeats: [] };
      }
      return { heartbeats: [] };
    }
    async overwrite(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return be(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: e.heartbeats,
        });
      }
    }
    async add(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return be(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: [...n.heartbeats, ...e.heartbeats],
        });
      }
    }
  }
  function ke(e) {
    return h(JSON.stringify({ version: 2, heartbeats: e })).length;
  }
  ce(new S('platform-logger', (e) => new Z(e), 'PRIVATE')),
    ce(new S('heartbeat', (e) => new ve(e), 'PRIVATE')),
    ge(ee, te, ''),
    ge(ee, te, 'esm2017'),
    ge('fire-js', '');
  const Be = '@firebase/installations',
    Se = '0.5.15',
    Ce = 'w:0.5.15',
    Le = new w('installations', 'Installations', {
      'missing-app-config-values':
        'Missing App configuration value: "{$valueName}"',
      'not-registered': 'Firebase Installation is not registered.',
      'installation-not-found': 'Firebase Installation not found.',
      'request-failed':
        '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
      'app-offline': 'Could not process request. Application offline.',
      'delete-pending-registration':
        "Can't delete installation while there is a pending registration request.",
    });
  function Ae(e) {
    return e instanceof b && e.code.includes('request-failed');
  }
  function Te({ projectId: e }) {
    return `https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`;
  }
  function Ee(e) {
    return {
      token: e.token,
      requestStatus: 2,
      expiresIn: ((t = e.expiresIn), Number(t.replace('s', '000'))),
      creationTime: Date.now(),
    };
    var t;
  }
  async function Me(e, t) {
    const n = (await t.json()).error;
    return Le.create('request-failed', {
      requestName: e,
      serverCode: n.code,
      serverMessage: n.message,
      serverStatus: n.status,
    });
  }
  function De({ apiKey: e }) {
    return new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-goog-api-key': e,
    });
  }
  async function _e(e) {
    const t = await e();
    return t.status >= 500 && t.status < 600 ? e() : t;
  }
  function xe(e) {
    return new Promise((t) => {
      setTimeout(t, e);
    });
  }
  const Re = /^[cdef][\w-]{21}$/;
  function Ne() {
    try {
      const e = new Uint8Array(17);
      (self.crypto || self.msCrypto).getRandomValues(e),
        (e[0] = 112 + (e[0] % 16));
      const t = (function (e) {
        return ((t = e),
        btoa(String.fromCharCode(...t))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')).substr(0, 22);
        var t;
      })(e);
      return Re.test(t) ? t : '';
    } catch (e) {
      return '';
    }
  }
  function Pe(e) {
    return `${e.appName}!${e.appId}`;
  }
  const Ue = new Map();
  function Fe(e, t) {
    const n = Pe(e);
    Oe(n, t),
      (function (e, t) {
        const n =
          (!je &&
            'BroadcastChannel' in self &&
            ((je = new BroadcastChannel('[Firebase] FID Change')),
            (je.onmessage = (e) => {
              Oe(e.data.key, e.data.fid);
            })),
          je);
        n && n.postMessage({ key: e, fid: t }),
          0 === Ue.size && je && (je.close(), (je = null));
      })(n, t);
  }
  function Oe(e, t) {
    const n = Ue.get(e);
    if (n) for (const e of n) e(t);
  }
  let je = null;
  const Ve = 'firebase-installations-store';
  let $e = null;
  function qe() {
    return (
      $e ||
        ($e = z('firebase-installations-database', 1, {
          upgrade: (e, t) => {
            0 === t && e.createObjectStore(Ve);
          },
        })),
      $e
    );
  }
  async function He(e, t) {
    const n = Pe(e),
      i = (await qe()).transaction(Ve, 'readwrite'),
      s = i.objectStore(Ve),
      a = await s.get(n);
    return (
      await s.put(t, n), await i.done, (a && a.fid === t.fid) || Fe(e, t.fid), t
    );
  }
  async function We(e) {
    const t = Pe(e),
      n = (await qe()).transaction(Ve, 'readwrite');
    await n.objectStore(Ve).delete(t), await n.done;
  }
  async function Ge(e, t) {
    const n = Pe(e),
      i = (await qe()).transaction(Ve, 'readwrite'),
      s = i.objectStore(Ve),
      a = await s.get(n),
      r = t(a);
    return (
      void 0 === r ? await s.delete(n) : await s.put(r, n),
      await i.done,
      !r || (a && a.fid === r.fid) || Fe(e, r.fid),
      r
    );
  }
  async function ze(e) {
    let t;
    const n = await Ge(e.appConfig, (n) => {
      const i = (function (e) {
          return Je(e || { fid: Ne(), registrationStatus: 0 });
        })(n),
        s = (function (e, t) {
          if (0 === t.registrationStatus) {
            if (!navigator.onLine)
              return {
                installationEntry: t,
                registrationPromise: Promise.reject(Le.create('app-offline')),
              };
            const n = {
                fid: t.fid,
                registrationStatus: 1,
                registrationTime: Date.now(),
              },
              i = (async function (e, t) {
                try {
                  const n = await (async function (
                    { appConfig: e, heartbeatServiceProvider: t },
                    { fid: n }
                  ) {
                    const i = Te(e),
                      s = De(e),
                      a = t.getImmediate({ optional: !0 });
                    if (a) {
                      const e = await a.getHeartbeatsHeader();
                      e && s.append('x-firebase-client', e);
                    }
                    const r = {
                        fid: n,
                        authVersion: 'FIS_v2',
                        appId: e.appId,
                        sdkVersion: Ce,
                      },
                      o = {
                        method: 'POST',
                        headers: s,
                        body: JSON.stringify(r),
                      },
                      c = await _e(() => fetch(i, o));
                    if (c.ok) {
                      const e = await c.json();
                      return {
                        fid: e.fid || n,
                        registrationStatus: 2,
                        refreshToken: e.refreshToken,
                        authToken: Ee(e.authToken),
                      };
                    }
                    throw await Me('Create Installation', c);
                  })(e, t);
                  return He(e.appConfig, n);
                } catch (n) {
                  throw (
                    (Ae(n) && 409 === n.customData.serverCode
                      ? await We(e.appConfig)
                      : await He(e.appConfig, {
                          fid: t.fid,
                          registrationStatus: 0,
                        }),
                    n)
                  );
                }
              })(e, n);
            return { installationEntry: n, registrationPromise: i };
          }
          return 1 === t.registrationStatus
            ? { installationEntry: t, registrationPromise: Qe(e) }
            : { installationEntry: t };
        })(e, i);
      return (t = s.registrationPromise), s.installationEntry;
    });
    return '' === n.fid
      ? { installationEntry: await t }
      : { installationEntry: n, registrationPromise: t };
  }
  async function Qe(e) {
    let t = await Ke(e.appConfig);
    for (; 1 === t.registrationStatus; )
      await xe(100), (t = await Ke(e.appConfig));
    if (0 === t.registrationStatus) {
      const { installationEntry: t, registrationPromise: n } = await ze(e);
      return n || t;
    }
    return t;
  }
  function Ke(e) {
    return Ge(e, (e) => {
      if (!e) throw Le.create('installation-not-found');
      return Je(e);
    });
  }
  function Je(e) {
    return 1 === (t = e).registrationStatus &&
      t.registrationTime + 1e4 < Date.now()
      ? { fid: e.fid, registrationStatus: 0 }
      : e;
    var t;
  }
  async function Xe({ appConfig: e, heartbeatServiceProvider: t }, n) {
    const i = (function (e, { fid: t }) {
        return `${Te(e)}/${t}/authTokens:generate`;
      })(e, n),
      s = (function (e, { refreshToken: t }) {
        const n = De(e);
        return (
          n.append(
            'Authorization',
            (function (e) {
              return `FIS_v2 ${e}`;
            })(t)
          ),
          n
        );
      })(e, n),
      a = t.getImmediate({ optional: !0 });
    if (a) {
      const e = await a.getHeartbeatsHeader();
      e && s.append('x-firebase-client', e);
    }
    const r = { installation: { sdkVersion: Ce, appId: e.appId } },
      o = { method: 'POST', headers: s, body: JSON.stringify(r) },
      c = await _e(() => fetch(i, o));
    if (c.ok) return Ee(await c.json());
    throw await Me('Generate Auth Token', c);
  }
  async function Ye(e, t = !1) {
    let n;
    const i = await Ge(e.appConfig, (i) => {
      if (!et(i)) throw Le.create('not-registered');
      const s = i.authToken;
      if (
        !t &&
        2 === (a = s).requestStatus &&
        !(function (e) {
          const t = Date.now();
          return t < e.creationTime || e.creationTime + e.expiresIn < t + 36e5;
        })(a)
      )
        return i;
      var a;
      if (1 === s.requestStatus)
        return (
          (n = (async function (e, t) {
            let n = await Ze(e.appConfig);
            for (; 1 === n.authToken.requestStatus; )
              await xe(100), (n = await Ze(e.appConfig));
            const i = n.authToken;
            return 0 === i.requestStatus ? Ye(e, t) : i;
          })(e, t)),
          i
        );
      {
        if (!navigator.onLine) throw Le.create('app-offline');
        const t = (function (e) {
          const t = { requestStatus: 1, requestTime: Date.now() };
          return Object.assign(Object.assign({}, e), { authToken: t });
        })(i);
        return (
          (n = (async function (e, t) {
            try {
              const n = await Xe(e, t),
                i = Object.assign(Object.assign({}, t), { authToken: n });
              return await He(e.appConfig, i), n;
            } catch (n) {
              if (
                !Ae(n) ||
                (401 !== n.customData.serverCode &&
                  404 !== n.customData.serverCode)
              ) {
                const n = Object.assign(Object.assign({}, t), {
                  authToken: { requestStatus: 0 },
                });
                await He(e.appConfig, n);
              } else await We(e.appConfig);
              throw n;
            }
          })(e, t)),
          t
        );
      }
    });
    return n ? await n : i.authToken;
  }
  function Ze(e) {
    return Ge(e, (e) => {
      if (!et(e)) throw Le.create('not-registered');
      return 1 === (t = e.authToken).requestStatus &&
        t.requestTime + 1e4 < Date.now()
        ? Object.assign(Object.assign({}, e), {
            authToken: { requestStatus: 0 },
          })
        : e;
      var t;
    });
  }
  function et(e) {
    return void 0 !== e && 2 === e.registrationStatus;
  }
  function tt(e) {
    return Le.create('missing-app-config-values', { valueName: e });
  }
  const nt = 'installations';
  ce(
    new S(
      nt,
      (e) => {
        const t = e.getProvider('app').getImmediate(),
          n = (function (e) {
            if (!e || !e.options) throw tt('App Configuration');
            if (!e.name) throw tt('App Name');
            const t = ['projectId', 'apiKey', 'appId'];
            for (const n of t) if (!e.options[n]) throw tt(n);
            return {
              appName: e.name,
              projectId: e.options.projectId,
              apiKey: e.options.apiKey,
              appId: e.options.appId,
            };
          })(t);
        return {
          app: t,
          appConfig: n,
          heartbeatServiceProvider: le(t, 'heartbeat'),
          _delete: () => Promise.resolve(),
        };
      },
      'PUBLIC'
    )
  ),
    ce(
      new S(
        'installations-internal',
        (e) => {
          const t = le(e.getProvider('app').getImmediate(), nt).getImmediate();
          return {
            getId: () =>
              (async function (e) {
                const t = e,
                  { installationEntry: n, registrationPromise: i } =
                    await ze(t);
                return (
                  i ? i.catch(console.error) : Ye(t).catch(console.error), n.fid
                );
              })(t),
            getToken: (e) =>
              (async function (e, t = !1) {
                const n = e;
                return (
                  await (async function (e) {
                    const { registrationPromise: t } = await ze(e);
                    t && (await t);
                  })(n),
                  (await Ye(n, t)).token
                );
              })(t, e),
          };
        },
        'PRIVATE'
      )
    ),
    ge(Be, Se),
    ge(Be, Se, 'esm2017');
  const it = 'analytics',
    st = 'https://www.googletagmanager.com/gtag/js',
    at = new N('@firebase/analytics');
  function rt(e) {
    return Promise.all(e.map((e) => e.catch((e) => e)));
  }
  const ot = new w('analytics', 'Analytics', {
      'already-exists':
        'A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.',
      'already-initialized':
        'initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.',
      'already-initialized-settings':
        'Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.',
      'interop-component-reg-failed':
        'Firebase Analytics Interop Component failed to instantiate: {$reason}',
      'invalid-analytics-context':
        'Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}',
      'indexeddb-unavailable':
        'IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}',
      'fetch-throttle':
        'The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.',
      'config-fetch-failed':
        'Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}',
      'no-api-key':
        'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
      'no-app-id':
        'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
    }),
    ct = new (class {
      constructor(e = {}, t = 1e3) {
        (this.throttleMetadata = e), (this.intervalMillis = t);
      }
      getThrottleMetadata(e) {
        return this.throttleMetadata[e];
      }
      setThrottleMetadata(e, t) {
        this.throttleMetadata[e] = t;
      }
      deleteThrottleMetadata(e) {
        delete this.throttleMetadata[e];
      }
    })();
  function lt(e) {
    return new Headers({ Accept: 'application/json', 'x-goog-api-key': e });
  }
  async function ut(e, t = ct, n) {
    const { appId: i, apiKey: s, measurementId: a } = e.options;
    if (!i) throw ot.create('no-app-id');
    if (!s) {
      if (a) return { measurementId: a, appId: i };
      throw ot.create('no-api-key');
    }
    const r = t.getThrottleMetadata(i) || {
        backoffCount: 0,
        throttleEndTimeMillis: Date.now(),
      },
      o = new ht();
    return (
      setTimeout(
        async () => {
          o.abort();
        },
        void 0 !== n ? n : 6e4
      ),
      dt({ appId: i, apiKey: s, measurementId: a }, r, o, t)
    );
  }
  async function dt(
    e,
    { throttleEndTimeMillis: t, backoffCount: n },
    i,
    s = ct
  ) {
    var a, r;
    const { appId: o, measurementId: c } = e;
    try {
      await (function (e, t) {
        return new Promise((n, i) => {
          const s = Math.max(t - Date.now(), 0),
            a = setTimeout(n, s);
          e.addEventListener(() => {
            clearTimeout(a),
              i(ot.create('fetch-throttle', { throttleEndTimeMillis: t }));
          });
        });
      })(i, t);
    } catch (e) {
      if (c)
        return (
          at.warn(
            `Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${null === (a = e) || void 0 === a ? void 0 : a.message}]`
          ),
          { appId: o, measurementId: c }
        );
      throw e;
    }
    try {
      const t = await (async function (e) {
        var t;
        const { appId: n, apiKey: i } = e,
          s = { method: 'GET', headers: lt(i) },
          a =
            'https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig'.replace(
              '{app-id}',
              n
            ),
          r = await fetch(a, s);
        if (200 !== r.status && 304 !== r.status) {
          let e = '';
          try {
            const n = await r.json();
            (null === (t = n.error) || void 0 === t ? void 0 : t.message) &&
              (e = n.error.message);
          } catch (e) {}
          throw ot.create('config-fetch-failed', {
            httpStatus: r.status,
            responseMessage: e,
          });
        }
        return r.json();
      })(e);
      return s.deleteThrottleMetadata(o), t;
    } catch (t) {
      const a = t;
      if (
        !(function (e) {
          if (!(e instanceof b && e.customData)) return !1;
          const t = Number(e.customData.httpStatus);
          return 429 === t || 500 === t || 503 === t || 504 === t;
        })(a)
      ) {
        if ((s.deleteThrottleMetadata(o), c))
          return (
            at.warn(
              `Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${c} provided in the "measurementId" field in the local Firebase config. [${null == a ? void 0 : a.message}]`
            ),
            { appId: o, measurementId: c }
          );
        throw t;
      }
      const l =
          503 ===
          Number(
            null === (r = null == a ? void 0 : a.customData) || void 0 === r
              ? void 0
              : r.httpStatus
          )
            ? k(n, s.intervalMillis, 30)
            : k(n, s.intervalMillis),
        u = { throttleEndTimeMillis: Date.now() + l, backoffCount: n + 1 };
      return (
        s.setThrottleMetadata(o, u),
        at.debug(`Calling attemptFetch again in ${l} millis`),
        dt(e, u, i, s)
      );
    }
  }
  class ht {
    constructor() {
      this.listeners = [];
    }
    addEventListener(e) {
      this.listeners.push(e);
    }
    abort() {
      this.listeners.forEach((e) => e());
    }
  }
  let gt, pt;
  async function ft(e, t, n, i, s, a, r) {
    var o;
    const c = ut(e);
    c
      .then((t) => {
        (n[t.measurementId] = t.appId),
          e.options.measurementId &&
            t.measurementId !== e.options.measurementId &&
            at.warn(
              `The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`
            );
      })
      .catch((e) => at.error(e)),
      t.push(c);
    const l = (async function () {
        var e;
        if (!g())
          return (
            at.warn(
              ot.create('indexeddb-unavailable', {
                errorInfo: 'IndexedDB is not available in this environment.',
              }).message
            ),
            !1
          );
        try {
          await p();
        } catch (t) {
          return (
            at.warn(
              ot.create('indexeddb-unavailable', {
                errorInfo:
                  null === (e = t) || void 0 === e ? void 0 : e.toString(),
              }).message
            ),
            !1
          );
        }
        return !0;
      })().then((e) => (e ? i.getId() : void 0)),
      [u, d] = await Promise.all([c, l]);
    (function (e) {
      const t = window.document.getElementsByTagName('script');
      for (const n of Object.values(t))
        if (n.src && n.src.includes(st) && n.src.includes(e)) return n;
      return null;
    })(a) ||
      (function (e, t) {
        const n = document.createElement('script');
        (n.src = `${st}?l=${e}&id=${t}`),
          (n.async = !0),
          document.head.appendChild(n);
      })(a, u.measurementId),
      pt && (s('consent', 'default', pt), (pt = void 0)),
      s('js', new Date());
    const h =
      null !== (o = null == r ? void 0 : r.config) && void 0 !== o ? o : {};
    return (
      (h.origin = 'firebase'),
      (h.update = !0),
      null != d && (h.firebase_id = d),
      s('config', u.measurementId, h),
      gt && (s('set', gt), (gt = void 0)),
      u.measurementId
    );
  }
  class mt {
    constructor(e) {
      this.app = e;
    }
    _delete() {
      return delete bt[this.app.options.appId], Promise.resolve();
    }
  }
  let bt = {},
    wt = [];
  const vt = {};
  let yt,
    It,
    kt = 'dataLayer',
    Bt = !1;
  function St(e, t, n) {
    !(function () {
      const e = [];
      if (
        ((function () {
          const e =
            'object' == typeof chrome
              ? chrome.runtime
              : 'object' == typeof browser
                ? browser.runtime
                : void 0;
          return 'object' == typeof e && void 0 !== e.id;
        })() && e.push('This is a browser extension environment.'),
        ('undefined' != typeof navigator && navigator.cookieEnabled) ||
          e.push('Cookies are not available.'),
        e.length > 0)
      ) {
        const t = e.map((e, t) => `(${t + 1}) ${e}`).join(' '),
          n = ot.create('invalid-analytics-context', { errorInfo: t });
        at.warn(n.message);
      }
    })();
    const i = e.options.appId;
    if (!i) throw ot.create('no-app-id');
    if (!e.options.apiKey) {
      if (!e.options.measurementId) throw ot.create('no-api-key');
      at.warn(
        `The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`
      );
    }
    if (null != bt[i]) throw ot.create('already-exists', { id: i });
    if (!Bt) {
      !(function (e) {
        let t = [];
        Array.isArray(window.dataLayer)
          ? (t = window.dataLayer)
          : (window.dataLayer = t);
      })();
      const { wrappedGtag: e, gtagCore: t } = (function (e, t, n, i, s) {
        let a = function (...e) {
          window.dataLayer.push(arguments);
        };
        return (
          window.gtag && 'function' == typeof window.gtag && (a = window.gtag),
          (window.gtag = (function (e, t, n, i) {
            return async function (s, a, r) {
              try {
                'event' === s
                  ? await (async function (e, t, n, i, s) {
                      try {
                        let a = [];
                        if (s && s.send_to) {
                          let e = s.send_to;
                          Array.isArray(e) || (e = [e]);
                          const i = await rt(n);
                          for (const n of e) {
                            const e = i.find((e) => e.measurementId === n),
                              s = e && t[e.appId];
                            if (!s) {
                              a = [];
                              break;
                            }
                            a.push(s);
                          }
                        }
                        0 === a.length && (a = Object.values(t)),
                          await Promise.all(a),
                          e('event', i, s || {});
                      } catch (e) {
                        at.error(e);
                      }
                    })(e, t, n, a, r)
                  : 'config' === s
                    ? await (async function (e, t, n, i, s, a) {
                        const r = i[s];
                        try {
                          if (r) await t[r];
                          else {
                            const e = (await rt(n)).find(
                              (e) => e.measurementId === s
                            );
                            e && (await t[e.appId]);
                          }
                        } catch (e) {
                          at.error(e);
                        }
                        e('config', s, a);
                      })(e, t, n, i, a, r)
                    : 'consent' === s
                      ? e('consent', 'update', r)
                      : e('set', a);
              } catch (e) {
                at.error(e);
              }
            };
          })(a, e, t, n)),
          { gtagCore: a, wrappedGtag: window.gtag }
        );
      })(bt, wt, vt);
      (It = e), (yt = t), (Bt = !0);
    }
    return (bt[i] = ft(e, wt, vt, t, yt, kt, n)), new mt(e);
  }
  function Ct(e, t, n, i) {
    (e = B(e)),
      (async function (e, t, n, i, s) {
        if (s && s.global) e('event', n, i);
        else {
          const s = await t;
          e('event', n, Object.assign(Object.assign({}, i), { send_to: s }));
        }
      })(It, bt[e.app.options.appId], t, n, i).catch((e) => at.error(e));
  }
  const Lt = '@firebase/analytics',
    At = '0.8.3';
  ce(
    new S(
      it,
      (e, { options: t }) =>
        St(
          e.getProvider('app').getImmediate(),
          e.getProvider('installations-internal').getImmediate(),
          t
        ),
      'PUBLIC'
    )
  ),
    ce(
      new S(
        'analytics-internal',
        function (e) {
          try {
            const t = e.getProvider(it).getImmediate();
            return { logEvent: (e, n, i) => Ct(t, e, n, i) };
          } catch (e) {
            throw ot.create('interop-component-reg-failed', { reason: e });
          }
        },
        'PRIVATE'
      )
    ),
    ge(Lt, At),
    ge(Lt, At, 'esm2017');
  class Tt {
    constructor() {}
    static getInstance() {
      return Tt.instance || (Tt.instance = new Tt()), Tt.instance;
    }
    static setAssessmentType(e) {
      Tt.assessmentType = e;
    }
    static getLocation() {
      console.log('starting to get location'),
        fetch('https://ipinfo.io/json?token=b6268727178610')
          .then((e) => {
            if ((console.log('got location response'), !e.ok))
              throw Error(e.statusText);
            return e.json();
          })
          .then((e) => {
            console.log(e), (Tt.latlong = e.loc);
            var t = Tt.latlong.split(','),
              n = parseFloat(t[0]).toFixed(2),
              i = parseFloat(t[1]).toFixed(1);
            return (
              (Tt.clat = n),
              (Tt.clon = i),
              (Tt.latlong = ''),
              (t = []),
              Tt.sendLocation(),
              {}
            );
          })
          .catch((e) => {
            console.warn(
              `location failed to update! encountered error ${e.msg}`
            );
          });
    }
    static linkAnalytics(e, t) {
      (Tt.gana = e), (Tt.dataURL = t);
    }
    static setUuid(e, t) {
      (Tt.uuid = e), (Tt.userSource = t);
    }
    static sendInit(e, t) {
      (Tt.appVersion = e), (Tt.contentVersion = t), Tt.getLocation();
      var n = 'user ' + Tt.uuid + ' opened the assessment';
      console.log(n), Ct(Tt.gana, 'opened', {});
    }
    static getAppLanguageFromDataURL(e) {
      return e && '' !== e && e.includes('-')
        ? e.split('-')[0]
        : 'NotAvailable';
    }
    static getAppTypeFromDataURL(e) {
      return e && '' !== e && e.includes('-')
        ? e.split('-')[1]
        : 'NotAvailable';
    }
    static sendLocation() {
      var e =
        'Sending User coordinates: ' +
        Tt.uuid +
        ' : ' +
        Tt.clat +
        ', ' +
        Tt.clon;
      console.log(e),
        Ct(Tt.gana, 'user_location', {
          user: Tt.uuid,
          lang: Tt.getAppLanguageFromDataURL(Tt.dataURL),
          app: Tt.getAppTypeFromDataURL(Tt.dataURL),
          latlong: Tt.joinLatLong(Tt.clat, Tt.clon),
        }),
        console.log('INITIALIZED EVENT SENT'),
        console.log(
          'App Language: ' + Tt.getAppLanguageFromDataURL(Tt.dataURL)
        ),
        console.log('App Type: ' + Tt.getAppTypeFromDataURL(Tt.dataURL)),
        console.log('App Version: ' + Tt.appVersion),
        console.log('Content Version: ' + Tt.contentVersion),
        Ct(Tt.gana, 'initialized', {
          type: 'initialized',
          clUserId: Tt.uuid,
          userSource: Tt.userSource,
          latLong: Tt.joinLatLong(Tt.clat, Tt.clon),
          appVersion: Tt.appVersion,
          contentVersion: Tt.contentVersion,
          app: Tt.getAppTypeFromDataURL(Tt.dataURL),
          lang: Tt.getAppLanguageFromDataURL(Tt.dataURL),
        });
    }
    static sendAnswered(e, t, n) {
      var i = e.answers[t - 1],
        s = null,
        a = null;
      'correct' in e && null != e.correct && (s = e.correct == i.answerName),
        'bucket' in e && (a = e.bucket);
      var r =
        'user ' + Tt.uuid + ' answered ' + e.qName + ' with ' + i.answerName;
      r += ', all answers were [';
      var o = '';
      for (var c in e.answers)
        (r += e.answers[c].answerName + ','),
          (o += e.answers[c].answerName + ',');
      (r += '] '),
        (r += s),
        (r += a),
        console.log(r),
        console.log('Answered App Version: ' + Tt.appVersion),
        console.log('Content Version: ' + Tt.contentVersion),
        Ct(Tt.gana, 'answered', {
          type: 'answered',
          clUserId: Tt.uuid,
          userSource: Tt.userSource,
          latLong: Tt.joinLatLong(Tt.clat, Tt.clon),
          app: Tt.getAppTypeFromDataURL(Tt.dataURL),
          lang: Tt.getAppLanguageFromDataURL(Tt.dataURL),
          dt: n,
          question_number: e.qNumber,
          target: e.qTarget,
          question: e.promptText,
          selected_answer: i.answerName,
          iscorrect: s,
          options: o,
          bucket: a,
          appVersion: Tt.appVersion,
          contentVersion: Tt.contentVersion,
        });
    }
    static sendBucket(e, t) {
      var n = e.bucketID,
        i = e.numTried,
        s = e.numCorrect,
        a =
          'user ' +
          Tt.uuid +
          ' finished the bucket ' +
          n +
          ' with ' +
          s +
          ' correct answers out of ' +
          i +
          ' tried and passed: ' +
          t;
      console.log(a),
        console.log('Bucket Completed App Version: ' + Tt.appVersion),
        console.log('Content Version: ' + Tt.contentVersion),
        Ct(Tt.gana, 'bucketCompleted', {
          type: 'bucketCompleted',
          clUserId: Tt.uuid,
          userSource: Tt.userSource,
          latLong: Tt.joinLatLong(Tt.clat, Tt.clon),
          app: Tt.getAppTypeFromDataURL(Tt.dataURL),
          lang: Tt.getAppLanguageFromDataURL(Tt.dataURL),
          bucketNumber: n,
          numberTriedInBucket: i,
          numberCorrectInBucket: s,
          passedBucket: t,
          appVersion: Tt.appVersion,
          contentVersion: Tt.contentVersion,
        });
    }
    static sendFinished(e = null, t, n) {
      let i = 'user ' + Tt.uuid + ' finished the assessment';
      console.log(i);
      let s = Tt.getBasalBucketID(e),
        a = Tt.getCeilingBucketID(e);
      0 == s && (s = a);
      let r = Tt.calculateScore(e, s);
      const o = 100 * e.length;
      console.log('Sending completed event'),
        console.log('Score: ' + r),
        console.log('Max Score: ' + o),
        console.log('Basal Bucket: ' + s),
        console.log('BASAL FROM ASSESSMENT: ' + t),
        console.log('Ceiling Bucket: ' + a),
        console.log('CEILING FROM ASSESSMENT: ' + n),
        console.log('Completed App Version: ' + Tt.appVersion),
        console.log('Content Version: ' + Tt.contentVersion),
        Tt.sendDataToThirdParty(r, Tt.uuid),
        Ct(Tt.gana, 'completed', {
          type: 'completed',
          clUserId: Tt.uuid,
          userSource: Tt.userSource,
          app: Tt.getAppTypeFromDataURL(Tt.dataURL),
          lang: Tt.getAppLanguageFromDataURL(Tt.dataURL),
          latLong: Tt.joinLatLong(Tt.clat, Tt.clon),
          score: r,
          maxScore: o,
          basalBucket: s,
          ceilingBucket: a,
          appVersion: Tt.appVersion,
          contentVersion: Tt.contentVersion,
        });
    }
    static sendDataToThirdParty(e, t) {
      console.log('Attempting to send score to a third party! Score: ', e);
      const n = new URLSearchParams(window.location.search),
        i = n.get('endpoint'),
        s = (n.get('organization'), new XMLHttpRequest());
      if (!i) return void console.error('No target party URL found!');
      const a = {
          user: t,
          page: '111108121363615',
          event: {
            type: 'external',
            value: {
              type: 'assessment',
              subType: Tt.assessmentType,
              score: e,
              completed: !0,
            },
          },
        },
        r = JSON.stringify(a);
      try {
        s.open('POST', i, !0),
          s.setRequestHeader('Content-Type', 'application/json'),
          (s.onload = function () {
            s.status >= 200 && s.status < 300
              ? console.log('POST success!' + s.responseText)
              : console.error('Request failed with status: ' + s.status);
          }),
          s.send(r);
      } catch (e) {
        console.error('Failed to send data to target party: ', e);
      }
    }
    static calculateScore(e, t) {
      console.log('Calculating score'), console.log(e);
      let n = 0;
      console.log('Basal Bucket ID: ' + t);
      let i = 0;
      for (const n in e) {
        const s = e[n];
        if (s.bucketID == t) {
          i = s.numCorrect;
          break;
        }
      }
      return (
        console.log(
          'Num Correct: ' + i,
          ' basal: ' + t,
          ' buckets: ' + e.length
        ),
        t === e.length && i >= 4
          ? (console.log('Perfect score'), 100 * e.length)
          : ((n = 0 | Math.round(100 * (t - 1) + (i / 5) * 100)), n)
      );
    }
    static getBasalBucketID(e) {
      let t = 0;
      for (const n in e) {
        const i = e[n];
        i.tested && !i.passed && (0 == t || i.bucketID < t) && (t = i.bucketID);
      }
      return t;
    }
    static getCeilingBucketID(e) {
      let t = 0;
      for (const n in e) {
        const i = e[n];
        i.tested && i.passed && (0 == t || i.bucketID > t) && (t = i.bucketID);
      }
      return t;
    }
    static joinLatLong(e, t) {
      return e + ',' + t;
    }
  }
  class Et {
    constructor() {
      (this.devModeAvailable = !1),
        (this.isInDevMode = !1),
        (this.isCorrectLabelShown = !1),
        (this.devModeToggleButtonContainerId =
          'devModeModalToggleButtonContainer'),
        (this.devModeToggleButtonId = 'devModeModalToggleButton'),
        (this.devModeModalId = 'devModeSettingsModal'),
        (this.devModeBucketGenSelectId = 'devModeBucketGenSelect'),
        (this.devModeCorrectLabelShownCheckboxId =
          'devModeCorrectLabelShownCheckbox'),
        (this.toggleDevModeModal = () => {
          'block' == this.devModeSettingsModal.style.display
            ? (this.devModeSettingsModal.style.display = 'none')
            : (this.devModeSettingsModal.style.display = 'block');
        }),
        (this.isInDevMode =
          window.location.href.includes('localhost') ||
          window.location.href.includes('127.0.0.1') ||
          window.location.href.includes('assessmentdev')),
        (this.devModeToggleButtonContainer = document.getElementById(
          this.devModeToggleButtonContainerId
        )),
        (this.devModeSettingsModal = document.getElementById(
          this.devModeModalId
        )),
        (this.devModeBucketGenSelect = document.getElementById(
          this.devModeBucketGenSelectId
        )),
        (this.devModeBucketGenSelect.onchange = (e) => {
          this.handleBucketGenModeChange(e);
        }),
        (this.devModeToggleButton = document.getElementById(
          this.devModeToggleButtonId
        )),
        (this.devModeToggleButton.onclick = this.toggleDevModeModal),
        (this.devModeCorrectLabelShownCheckbox = document.getElementById(
          this.devModeCorrectLabelShownCheckboxId
        )),
        (this.devModeCorrectLabelShownCheckbox.onchange = () => {
          (this.isCorrectLabelShown =
            this.devModeCorrectLabelShownCheckbox.checked),
            this.handleCorrectLabelShownChange();
        }),
        this.isInDevMode
          ? (this.devModeToggleButtonContainer.style.display = 'block')
          : (this.devModeToggleButtonContainer.style.display = 'none');
    }
    hideDevModeButton() {
      this.devModeToggleButtonContainer.style.display = 'none';
    }
    onEnd() {
      l.ShowEnd(), this.app.unityBridge.SendClose();
    }
  }
  class Mt extends Et {
    constructor(e, t) {
      super(),
        (this.handleBucketGenModeChange = () => {
          console.log('Bucket Gen Mode Changed');
        }),
        (this.handleCorrectLabelShownChange = () => {
          console.log('Correct Label Shown Changed');
        }),
        (this.startSurvey = () => {
          l.ReadyForNext(this.getNextQuestion());
        }),
        (this.onQuestionEnd = () => {
          l.SetFeedbackVisibile(!1),
            (this.currentQuestionIndex += 1),
            setTimeout(() => {
              this.HasQuestionsLeft()
                ? l.ReadyForNext(this.getNextQuestion())
                : (console.log('There are no questions left.'), this.onEnd());
            }, 500);
        }),
        (this.TryAnswer = (e, t) => {
          Tt.sendAnswered(this.questionsData[this.currentQuestionIndex], e, t),
            l.SetFeedbackVisibile(!0),
            l.AddStar(),
            setTimeout(() => {
              this.onQuestionEnd();
            }, 2e3);
        }),
        (this.buildQuestionList = () =>
          (function (e) {
            return i(this, void 0, void 0, function* () {
              return a(e).then((e) => e.questions);
            });
          })(this.app.dataURL)),
        console.log('Survey initialized'),
        (this.dataURL = e),
        (this.unityBridge = t),
        (this.currentQuestionIndex = 0),
        l.SetButtonPressAction(this.TryAnswer),
        l.SetStartAction(this.startSurvey);
    }
    Run(e) {
      return (
        (t = this),
        (n = void 0),
        (s = function* () {
          (this.app = e),
            this.buildQuestionList().then((e) => {
              (this.questionsData = e),
                r.PrepareAudioAndImagesForSurvey(
                  this.questionsData,
                  this.app.GetDataURL()
                ),
                this.unityBridge.SendLoaded();
            });
        }),
        new ((i = void 0) || (i = Promise))(function (e, a) {
          function r(e) {
            try {
              c(s.next(e));
            } catch (e) {
              a(e);
            }
          }
          function o(e) {
            try {
              c(s.throw(e));
            } catch (e) {
              a(e);
            }
          }
          function c(t) {
            var n;
            t.done
              ? e(t.value)
              : ((n = t.value),
                n instanceof i
                  ? n
                  : new i(function (e) {
                      e(n);
                    })).then(r, o);
          }
          c((s = s.apply(t, n || [])).next());
        })
      );
      var t, n, i, s;
    }
    HasQuestionsLeft() {
      return this.currentQuestionIndex <= this.questionsData.length - 1;
    }
    getNextQuestion() {
      return this.questionsData[this.currentQuestionIndex];
    }
  }
  class Dt {
    constructor(e) {
      (this.value = e), (this.left = null), (this.right = null);
    }
  }
  function _t(e, t, n) {
    if (e > t) return null;
    let i;
    if ((e + t) % 2 == 0 && 1 !== n.size) {
      if (((i = Math.floor((e + t) / 2)), 0 === i)) return null;
    } else
      do {
        (i = Math.floor((e + t) / 2)), (i += Math.floor(2 * Math.random()));
      } while (i > t || n.has(i));
    n.add(i);
    let s = new Dt(i);
    return (s.left = _t(e, i - 1, n)), (s.right = _t(i + 1, t, n)), s;
  }
  var xt, Rt;
  !(function (e) {
    (e[(e.BinarySearch = 0)] = 'BinarySearch'),
      (e[(e.LinearSearchUp = 1)] = 'LinearSearchUp'),
      (e[(e.LinearSearchDown = 2)] = 'LinearSearchDown');
  })(xt || (xt = {})),
    (function (e) {
      (e[(e.RandomBST = 0)] = 'RandomBST'),
        (e[(e.LinearArrayBased = 1)] = 'LinearArrayBased');
    })(Rt || (Rt = {}));
  class Nt extends Et {
    constructor(e, t) {
      super(),
        (this.bucketGenMode = Rt.RandomBST),
        (this.MAX_STARS_COUNT_IN_LINEAR_MODE = 20),
        (this.startAssessment = () => {
          l.ReadyForNext(this.getNextQuestion()),
            this.isInDevMode && this.hideDevModeButton();
        }),
        (this.buildBuckets = (e) => {
          return (
            (t = this),
            (n = void 0),
            (r = function* () {
              if (void 0 === this.buckets || 0 === this.buckets.length) {
                var t = (function (e) {
                  return i(this, void 0, void 0, function* () {
                    return a(e).then((e) => e.buckets);
                  });
                })(this.app.GetDataURL()).then((e) => {
                  (this.buckets = e),
                    (this.numBuckets = e.length),
                    console.log('buckets: ' + this.buckets),
                    (this.bucketArray = Array.from(
                      Array(this.numBuckets),
                      (e, t) => t + 1
                    )),
                    console.log('empty array ' + this.bucketArray);
                  let t = new Set();
                  t.add(0);
                  let n = _t(
                      this.buckets[0].bucketID - 1,
                      this.buckets[this.buckets.length - 1].bucketID,
                      t
                    ),
                    i = this.convertToBucketBST(n, this.buckets);
                  console.log(
                    'Generated the buckets root ----------------------------------------------'
                  ),
                    console.log(i),
                    (this.basalBucket = this.numBuckets + 1),
                    (this.ceilingBucket = -1),
                    (this.currentNode = i),
                    this.tryMoveBucket(!1);
                });
                return t;
              }
              return e === Rt.RandomBST
                ? new Promise((e, t) => {
                    let n = new Set();
                    n.add(0);
                    let i = _t(
                        this.buckets[0].bucketID - 1,
                        this.buckets[this.buckets.length - 1].bucketID,
                        n
                      ),
                      s = this.convertToBucketBST(i, this.buckets);
                    console.log(
                      'Generated the buckets root ----------------------------------------------'
                    ),
                      console.log(s),
                      (this.basalBucket = this.numBuckets + 1),
                      (this.ceilingBucket = -1),
                      (this.currentNode = s),
                      this.tryMoveBucket(!1),
                      e();
                  })
                : e === Rt.LinearArrayBased
                  ? new Promise((e, t) => {
                      (this.currentLinearBucketIndex = 0),
                        (this.currentLinearTargetIndex = 0),
                        this.tryMoveBucket(!1),
                        e();
                    })
                  : void 0;
            }),
            new ((s = void 0) || (s = Promise))(function (e, i) {
              function a(e) {
                try {
                  c(r.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function o(e) {
                try {
                  c(r.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function c(t) {
                var n;
                t.done
                  ? e(t.value)
                  : ((n = t.value),
                    n instanceof s
                      ? n
                      : new s(function (e) {
                          e(n);
                        })).then(a, o);
              }
              c((r = r.apply(t, n || [])).next());
            })
          );
          var t, n, s, r;
        }),
        (this.convertToBucketBST = (e, t) => {
          if (null === e) return e;
          let n = e.value;
          return (
            (e.value = t.find((e) => e.bucketID === n)),
            null !== e.left && (e.left = this.convertToBucketBST(e.left, t)),
            null !== e.right && (e.right = this.convertToBucketBST(e.right, t)),
            e
          );
        }),
        (this.initBucket = (e) => {
          (this.currentBucket = e),
            (this.currentBucket.usedItems = []),
            (this.currentBucket.numTried = 0),
            (this.currentBucket.numCorrect = 0),
            (this.currentBucket.numConsecutiveWrong = 0),
            (this.currentBucket.tested = !0),
            (this.currentBucket.passed = !1);
        }),
        (this.TryAnswer = (e, t) => {
          this.bucketGenMode === Rt.RandomBST &&
            Tt.sendAnswered(this.currentQuestion, e, t),
            (this.currentBucket.numTried += 1),
            this.currentQuestion.answers[e - 1].answerName ==
            this.currentQuestion.correct
              ? ((this.currentBucket.numCorrect += 1),
                (this.currentBucket.numConsecutiveWrong = 0),
                console.log('Answered correctly'))
              : ((this.currentBucket.numConsecutiveWrong += 1),
                console.log(
                  'Answered incorrectly, ' +
                    this.currentBucket.numConsecutiveWrong
                )),
            ((this.bucketGenMode === Rt.LinearArrayBased &&
              l.getInstance().shownStarsCount <
                this.MAX_STARS_COUNT_IN_LINEAR_MODE) ||
              this.bucketGenMode === Rt.RandomBST) &&
              l.AddStar(),
            l.SetFeedbackVisibile(!0),
            setTimeout(() => {
              console.log('Completed first Timeout'), this.onQuestionEnd();
            }, 2e3);
        }),
        (this.onQuestionEnd = () => {
          let e = this.HasQuestionsLeft() ? 500 : 4e3;
          const t = () => {
            l.SetFeedbackVisibile(!1),
              ((this.bucketGenMode === Rt.LinearArrayBased &&
                l.getInstance().shownStarsCount <
                  this.MAX_STARS_COUNT_IN_LINEAR_MODE) ||
                this.bucketGenMode === Rt.RandomBST) &&
                l.ChangeStarImageAfterAnimation(),
              this.HasQuestionsLeft()
                ? (this.bucketGenMode === Rt.LinearArrayBased &&
                    (this.currentLinearTargetIndex <
                      this.buckets[this.currentLinearBucketIndex].items
                        .length &&
                      (this.currentLinearTargetIndex++,
                      (this.currentBucket.usedItems = [])),
                    this.currentLinearTargetIndex >=
                      this.buckets[this.currentLinearBucketIndex].items
                        .length &&
                      this.currentLinearBucketIndex < this.buckets.length &&
                      (this.currentLinearBucketIndex++,
                      (this.currentLinearTargetIndex = 0),
                      this.tryMoveBucket(!1))),
                  l.ReadyForNext(this.getNextQuestion()))
                : (console.log('No questions left'), this.onEnd());
          };
          new Promise((t) => {
            setTimeout(() => {
              t();
            }, e);
          }).then(() => {
            t();
          });
        }),
        (this.getNextQuestion = () => {
          if (
            this.bucketGenMode === Rt.LinearArrayBased &&
            this.currentLinearTargetIndex >=
              this.buckets[this.currentLinearBucketIndex].items.length
          )
            return null;
          var e, t, n, i;
          if (this.bucketGenMode === Rt.RandomBST) {
            do {
              e = o(this.currentBucket.items);
            } while (this.currentBucket.usedItems.includes(e));
            this.currentBucket.usedItems.push(e);
            do {
              t = o(this.currentBucket.items);
            } while (e == t);
            do {
              n = o(this.currentBucket.items);
            } while (e == n || t == n);
            do {
              i = o(this.currentBucket.items);
            } while (e == i || t == i || n == i);
          } else if (this.bucketGenMode === Rt.LinearArrayBased) {
            (e =
              this.buckets[this.currentLinearBucketIndex].items[
                this.currentLinearTargetIndex
              ]),
              this.currentBucket.usedItems.push(e);
            do {
              t = o(this.buckets[this.currentLinearBucketIndex].items);
            } while (e == t);
            do {
              n = o(this.buckets[this.currentLinearBucketIndex].items);
            } while (e == n || t == n);
            do {
              i = o(this.buckets[this.currentLinearBucketIndex].items);
            } while (e == i || t == i || n == i);
          }
          let s = [e, t, n, i];
          c(s);
          var a = {
            qName: 'question-' + this.questionNumber + '-' + e.itemName,
            qNumber: this.questionNumber,
            qTarget: e.itemName,
            promptText: '',
            bucket: this.currentBucket.bucketID,
            promptAudio: e.itemName,
            correct: e.itemText,
            answers: [
              { answerName: s[0].itemName, answerText: s[0].itemText },
              { answerName: s[1].itemName, answerText: s[1].itemText },
              { answerName: s[2].itemName, answerText: s[2].itemText },
              { answerName: s[3].itemName, answerText: s[3].itemText },
            ],
          };
          return (this.currentQuestion = a), (this.questionNumber += 1), a;
        }),
        (this.tryMoveBucket = (e) => {
          this.bucketGenMode === Rt.RandomBST
            ? this.tryMoveBucketRandomBST(e)
            : this.bucketGenMode === Rt.LinearArrayBased &&
              this.tryMoveBucketLinearArrayBased(e);
        }),
        (this.tryMoveBucketRandomBST = (e) => {
          const t = this.currentNode.value;
          null != this.currentBucket &&
            ((this.currentBucket.passed = e),
            Tt.sendBucket(this.currentBucket, e)),
            console.log('new  bucket is ' + t.bucketID),
            r.PreloadBucket(t, this.app.GetDataURL()),
            this.initBucket(t);
        }),
        (this.tryMoveBucketLinearArrayBased = (e) => {
          const t = this.buckets[this.currentLinearBucketIndex];
          console.log('New Bucket: ' + t.bucketID),
            r.PreloadBucket(t, this.app.GetDataURL()),
            this.initBucket(t);
        }),
        (this.HasQuestionsLeft = () => {
          var e = !0;
          return (
            !this.currentBucket.passed &&
            (this.bucketGenMode === Rt.LinearArrayBased
              ? !(
                  this.currentLinearBucketIndex >= this.buckets.length &&
                  this.currentLinearTargetIndex >=
                    this.buckets[this.currentLinearBucketIndex].items.length
                )
              : (this.currentBucket.numCorrect >= 4
                  ? (console.log(
                      'Passed this bucket ' + this.currentBucket.bucketID
                    ),
                    this.currentBucket.bucketID >= this.numBuckets
                      ? (console.log('Passed highest bucket'),
                        (this.currentBucket.passed = !0),
                        this.bucketGenMode === Rt.RandomBST &&
                          Tt.sendBucket(this.currentBucket, !0),
                        l.ProgressChest(),
                        (e = !1))
                      : (console.log('Moving up bucket'),
                        null != this.currentNode.right
                          ? (l.ProgressChest(),
                            console.log('Moving to right node'),
                            this.bucketGenMode === Rt.RandomBST
                              ? (this.currentNode = this.currentNode.right)
                              : this.currentLinearBucketIndex++,
                            this.tryMoveBucket(!0))
                          : (console.log('Reached root node'),
                            (this.currentBucket.passed = !0),
                            this.bucketGenMode === Rt.RandomBST &&
                              Tt.sendBucket(this.currentBucket, !0),
                            l.ProgressChest(),
                            (e = !1))))
                  : (this.currentBucket.numConsecutiveWrong >= 2 ||
                      this.currentBucket.numTried >= 5) &&
                    (console.log(
                      'Failed this bucket ' + this.currentBucket.bucketID
                    ),
                    this.currentBucket.bucketID < this.basalBucket &&
                      (this.basalBucket = this.currentBucket.bucketID),
                    this.currentBucket.bucketID <= 1
                      ? (console.log('Failed lowest bucket !'),
                        (e = !1),
                        (this.currentBucket.passed = !1),
                        this.bucketGenMode === Rt.RandomBST &&
                          Tt.sendBucket(this.currentBucket, !1))
                      : (console.log('Moving down bucket !'),
                        null != this.currentNode.left
                          ? (console.log('Moving to left node'),
                            this.bucketGenMode === Rt.RandomBST
                              ? (this.currentNode = this.currentNode.left)
                              : this.currentLinearBucketIndex++,
                            this.tryMoveBucket(!1))
                          : (console.log('Reached root node !'),
                            (e = !1),
                            (this.currentBucket.passed = !1),
                            this.bucketGenMode === Rt.RandomBST &&
                              Tt.sendBucket(this.currentBucket, !1)))),
                e))
          );
        }),
        (this.dataURL = e),
        (this.unityBridge = t),
        (this.questionNumber = 0),
        console.log('app initialized'),
        l.SetButtonPressAction(this.TryAnswer),
        l.SetStartAction(this.startAssessment);
    }
    Run(e) {
      (this.app = e),
        this.buildBuckets(this.bucketGenMode).then((e) => {
          console.log(this.currentBucket), this.unityBridge.SendLoaded();
        });
    }
    handleBucketGenModeChange(e) {
      (this.bucketGenMode = parseInt(this.devModeBucketGenSelect.value)),
        this.buildBuckets(this.bucketGenMode).then(() => {});
    }
    handleCorrectLabelShownChange() {
      l.getInstance().SetCorrectLabelVisibility(this.isCorrectLabelShown);
    }
    onEnd() {
      Tt.sendFinished(this.buckets, this.basalBucket, this.ceilingBucket),
        l.ShowEnd(),
        this.app.unityBridge.SendClose();
    }
  }
  class Pt {
    constructor() {
      'undefined' != typeof Unity
        ? (this.unityReference = Unity)
        : (this.unityReference = null);
    }
    SendMessage(e) {
      null !== this.unityReference && this.unityReference.call(e);
    }
    SendLoaded() {
      null !== this.unityReference
        ? this.unityReference.call('loaded')
        : console.log('would call Unity loaded now');
    }
    SendClose() {
      null !== this.unityReference
        ? this.unityReference.call('close')
        : console.log('would close Unity now');
    }
  }
  ge('firebase', '9.12.1', 'app');
  try {
    self['workbox:window:7.0.0'] && _();
  } catch (Ut) {}
  function Ut(e, t) {
    return new Promise(function (n) {
      var i = new MessageChannel();
      (i.port1.onmessage = function (e) {
        n(e.data);
      }),
        e.postMessage(t, [i.port2]);
    });
  }
  function Ft(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, i = new Array(t); n < t; n++) i[n] = e[n];
    return i;
  }
  function Ot(e, t) {
    var n;
    if ('undefined' == typeof Symbol || null == e[Symbol.iterator]) {
      if (
        Array.isArray(e) ||
        (n = (function (e, t) {
          if (e) {
            if ('string' == typeof e) return Ft(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            return (
              'Object' === n && e.constructor && (n = e.constructor.name),
              'Map' === n || 'Set' === n
                ? Array.from(e)
                : 'Arguments' === n ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                  ? Ft(e, t)
                  : void 0
            );
          }
        })(e)) ||
        (t && e && 'number' == typeof e.length)
      ) {
        n && (e = n);
        var i = 0;
        return function () {
          return i >= e.length ? { done: !0 } : { done: !1, value: e[i++] };
        };
      }
      throw new TypeError(
        'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
      );
    }
    return (n = e[Symbol.iterator]()).next.bind(n);
  }
  try {
    self['workbox:core:7.0.0'] && _();
  } catch (Ut) {}
  var jt = function () {
    var e = this;
    this.promise = new Promise(function (t, n) {
      (e.resolve = t), (e.reject = n);
    });
  };
  function Vt(e, t) {
    var n = location.href;
    return new URL(e, n).href === new URL(t, n).href;
  }
  var $t = function (e, t) {
    (this.type = e), Object.assign(this, t);
  };
  function qt(e, t, n) {
    return n
      ? t
        ? t(e)
        : e
      : ((e && e.then) || (e = Promise.resolve(e)), t ? e.then(t) : e);
  }
  function Ht() {}
  var Wt = { type: 'SKIP_WAITING' };
  function Gt(e, t) {
    if (!t) return e && e.then ? e.then(Ht) : Promise.resolve();
  }
  var zt = (function (e) {
    var t, n;
    function i(t, n) {
      var i, s;
      return (
        void 0 === n && (n = {}),
        ((i = e.call(this) || this).nn = {}),
        (i.tn = 0),
        (i.rn = new jt()),
        (i.en = new jt()),
        (i.on = new jt()),
        (i.un = 0),
        (i.an = new Set()),
        (i.cn = function () {
          var e = i.fn,
            t = e.installing;
          i.tn > 0 ||
          !Vt(t.scriptURL, i.sn.toString()) ||
          performance.now() > i.un + 6e4
            ? ((i.vn = t), e.removeEventListener('updatefound', i.cn))
            : ((i.hn = t), i.an.add(t), i.rn.resolve(t)),
            ++i.tn,
            t.addEventListener('statechange', i.ln);
        }),
        (i.ln = function (e) {
          var t = i.fn,
            n = e.target,
            s = n.state,
            a = n === i.vn,
            r = { sw: n, isExternal: a, originalEvent: e };
          !a && i.mn && (r.isUpdate = !0),
            i.dispatchEvent(new $t(s, r)),
            'installed' === s
              ? (i.wn = self.setTimeout(function () {
                  'installed' === s &&
                    t.waiting === n &&
                    i.dispatchEvent(new $t('waiting', r));
                }, 200))
              : 'activating' === s &&
                (clearTimeout(i.wn), a || i.en.resolve(n));
        }),
        (i.dn = function (e) {
          var t = i.hn,
            n = t !== navigator.serviceWorker.controller;
          i.dispatchEvent(
            new $t('controlling', {
              isExternal: n,
              originalEvent: e,
              sw: t,
              isUpdate: i.mn,
            })
          ),
            n || i.on.resolve(t);
        }),
        (i.gn =
          ((s = function (e) {
            var t = e.data,
              n = e.ports,
              s = e.source;
            return qt(i.getSW(), function () {
              i.an.has(s) &&
                i.dispatchEvent(
                  new $t('message', {
                    data: t,
                    originalEvent: e,
                    ports: n,
                    sw: s,
                  })
                );
            });
          }),
          function () {
            for (var e = [], t = 0; t < arguments.length; t++)
              e[t] = arguments[t];
            try {
              return Promise.resolve(s.apply(this, e));
            } catch (e) {
              return Promise.reject(e);
            }
          })),
        (i.sn = t),
        (i.nn = n),
        navigator.serviceWorker.addEventListener('message', i.gn),
        i
      );
    }
    (n = e),
      ((t = i).prototype = Object.create(n.prototype)),
      (t.prototype.constructor = t),
      (t.__proto__ = n);
    var s,
      a = i.prototype;
    return (
      (a.register = function (e) {
        var t = (void 0 === e ? {} : e).immediate,
          n = void 0 !== t && t;
        try {
          var i = this;
          return (function (e, t) {
            var n = e();
            return n && n.then ? n.then(t) : t();
          })(
            function () {
              if (!n && 'complete' !== document.readyState)
                return Gt(
                  new Promise(function (e) {
                    return window.addEventListener('load', e);
                  })
                );
            },
            function () {
              return (
                (i.mn = Boolean(navigator.serviceWorker.controller)),
                (i.yn = i.pn()),
                qt(i.bn(), function (e) {
                  (i.fn = e),
                    i.yn &&
                      ((i.hn = i.yn),
                      i.en.resolve(i.yn),
                      i.on.resolve(i.yn),
                      i.yn.addEventListener('statechange', i.ln, { once: !0 }));
                  var t = i.fn.waiting;
                  return (
                    t &&
                      Vt(t.scriptURL, i.sn.toString()) &&
                      ((i.hn = t),
                      Promise.resolve()
                        .then(function () {
                          i.dispatchEvent(
                            new $t('waiting', {
                              sw: t,
                              wasWaitingBeforeRegister: !0,
                            })
                          );
                        })
                        .then(function () {})),
                    i.hn && (i.rn.resolve(i.hn), i.an.add(i.hn)),
                    i.fn.addEventListener('updatefound', i.cn),
                    navigator.serviceWorker.addEventListener(
                      'controllerchange',
                      i.dn
                    ),
                    i.fn
                  );
                })
              );
            }
          );
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (a.update = function () {
        try {
          return this.fn ? Gt(this.fn.update()) : void 0;
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (a.getSW = function () {
        return void 0 !== this.hn ? Promise.resolve(this.hn) : this.rn.promise;
      }),
      (a.messageSW = function (e) {
        try {
          return qt(this.getSW(), function (t) {
            return Ut(t, e);
          });
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (a.messageSkipWaiting = function () {
        this.fn && this.fn.waiting && Ut(this.fn.waiting, Wt);
      }),
      (a.pn = function () {
        var e = navigator.serviceWorker.controller;
        return e && Vt(e.scriptURL, this.sn.toString()) ? e : void 0;
      }),
      (a.bn = function () {
        try {
          var e = this;
          return (function (e, t) {
            try {
              var n = e();
            } catch (e) {
              return t(e);
            }
            return n && n.then ? n.then(void 0, t) : n;
          })(
            function () {
              return qt(
                navigator.serviceWorker.register(e.sn, e.nn),
                function (t) {
                  return (e.un = performance.now()), t;
                }
              );
            },
            function (e) {
              throw e;
            }
          );
        } catch (e) {
          return Promise.reject(e);
        }
      }),
      (s = [
        {
          key: 'active',
          get: function () {
            return this.en.promise;
          },
        },
        {
          key: 'controlling',
          get: function () {
            return this.on.promise;
          },
        },
      ]) &&
        (function (e, t) {
          for (var n = 0; n < t.length; n++) {
            var i = t[n];
            (i.enumerable = i.enumerable || !1),
              (i.configurable = !0),
              'value' in i && (i.writable = !0),
              Object.defineProperty(e, i.key, i);
          }
        })(i.prototype, s),
      i
    );
  })(
    (function () {
      function e() {
        this.Pn = new Map();
      }
      var t = e.prototype;
      return (
        (t.addEventListener = function (e, t) {
          this.Sn(e).add(t);
        }),
        (t.removeEventListener = function (e, t) {
          this.Sn(e).delete(t);
        }),
        (t.dispatchEvent = function (e) {
          e.target = this;
          for (var t, n = Ot(this.Sn(e.type)); !(t = n()).done; )
            (0, t.value)(e);
        }),
        (t.Sn = function (e) {
          return this.Pn.has(e) || this.Pn.set(e, new Set()), this.Pn.get(e);
        }),
        e
      );
    })()
  );
  var Qt = function (e, t, n, i) {
    return new (n || (n = Promise))(function (s, a) {
      function r(e) {
        try {
          c(i.next(e));
        } catch (e) {
          a(e);
        }
      }
      function o(e) {
        try {
          c(i.throw(e));
        } catch (e) {
          a(e);
        }
      }
      function c(e) {
        var t;
        e.done
          ? s(e.value)
          : ((t = e.value),
            t instanceof n
              ? t
              : new n(function (e) {
                  e(t);
                })).then(r, o);
      }
      c((i = i.apply(e, t || [])).next());
    });
  };
  let Kt = document.getElementById('loadingScreen');
  const Jt = new BroadcastChannel('as-message-channel');
  function Xt(e) {
    'Loading' == e.data.msg &&
      (function (e, t) {
        let n = document.getElementById('progressBar');
        t < 100 && t >= 10
          ? (n.style.width = t + '%')
          : t >= 100 &&
            ((Kt.style.display = 'none'),
            l.SetContentLoaded(!0),
            localStorage.setItem(e.data.data.bookName, 'true'),
            (function (e) {
              if (window.Android) {
                let t = null !== localStorage.getItem(e);
                window.Android.cachedStatus(t);
              }
            })(e.data.data.bookName));
      })(e, parseInt(e.data.data.progress)),
      'UpdateFound' == e.data.msg &&
        (console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>.,update Found'),
        (function () {
          let e = 'Update Found.\nPlease accept the update by pressing Ok.';
          1 == confirm(e)
            ? window.location.reload()
            : (e = 'Update will happen on the next launch.');
        })());
  }
  Jt.addEventListener('message', Xt);
  const Yt = new (class {
    constructor() {
      (this.lang = 'english'),
        (this.unityBridge = new Pt()),
        console.log('Initializing app...'),
        (this.dataURL = t()),
        (this.cacheModel = new (class {
          constructor(e, t, n) {
            (this.appName = e),
              (this.contentFilePath = t),
              (this.audioVisualResources = n);
          }
          setAppName(e) {
            this.appName = e;
          }
          setContentFilePath(e) {
            this.contentFilePath = e;
          }
          setAudioVisualResources(e) {
            this.audioVisualResources = e;
          }
          addItemToAudioVisualResources(e) {
            this.audioVisualResources.has(e) ||
              this.audioVisualResources.add(e);
          }
        })(this.dataURL, this.dataURL, new Set()));
      const e = (function (
        e = (function (e = '[DEFAULT]') {
          const t = ae.get(e);
          if (!t && e === ie) return he();
          if (!t) throw ue.create('no-app', { appName: e });
          return t;
        })()
      ) {
        const t = le((e = B(e)), it);
        return t.isInitialized()
          ? t.getImmediate()
          : (function (e, t = {}) {
              const n = le(e, it);
              if (n.isInitialized()) {
                const e = n.getImmediate();
                if (y(t, n.getOptions())) return e;
                throw ot.create('already-initialized');
              }
              return n.initialize({ options: t });
            })(e);
      })(
        he({
          apiKey: 'AIzaSyB8c2lBVi26u7YRL9sxOP97Uaq3yN8hTl4',
          authDomain: 'ftm-b9d99.firebaseapp.com',
          databaseURL: 'https://ftm-b9d99.firebaseio.com',
          projectId: 'ftm-b9d99',
          storageBucket: 'ftm-b9d99.appspot.com',
          messagingSenderId: '602402387941',
          appId: '1:602402387941:web:7b1b1181864d28b49de10c',
          measurementId: 'G-FF1159TGCF',
        })
      );
      (this.analytics = e),
        Ct(e, 'notification_received'),
        Ct(e, 'test initialization event', {}),
        console.log('firebase initialized');
    }
    spinUp() {
      return Qt(this, void 0, void 0, function* () {
        window.addEventListener('load', () => {
          console.log('Window Loaded!'),
            (() => {
              Qt(this, void 0, void 0, function* () {
                yield (function (e) {
                  return i(this, void 0, void 0, function* () {
                    return a(e).then((e) => e);
                  });
                })(this.dataURL).then((e) => {
                  console.log('Assessment/Survey v1.0.7 initializing!'),
                    console.log('App data loaded!'),
                    console.log(e),
                    this.cacheModel.setContentFilePath(s(this.dataURL)),
                    l.SetFeedbackText(e.feedbackText);
                  let t = e.appType,
                    i = e.assessmentType;
                  if ('survey' == t)
                    this.game = new Mt(this.dataURL, this.unityBridge);
                  else if ('assessment' == t) {
                    let t = e.buckets;
                    for (let n = 0; n < t.length; n++)
                      for (let i = 0; i < t[n].items.length; i++) {
                        let s;
                        (s =
                          e.quizName.includes('Luganda') ||
                          e.quizName
                            .toLowerCase()
                            .includes('west african english')
                            ? '/audio/' +
                              this.dataURL +
                              '/' +
                              t[n].items[i].itemName.toLowerCase().trim() +
                              '.mp3'
                            : '/audio/' +
                              this.dataURL +
                              '/' +
                              t[n].items[i].itemName.trim() +
                              '.mp3'),
                          this.cacheModel.addItemToAudioVisualResources(s);
                      }
                    this.cacheModel.addItemToAudioVisualResources(
                      '/audio/' + this.dataURL + '/answer_feedback.mp3'
                    ),
                      (this.game = new Nt(this.dataURL, this.unityBridge));
                  }
                  var a;
                  (this.game.unityBridge = this.unityBridge),
                    Tt.setUuid(
                      (null == (a = n().get('cr_user_id')) &&
                        (console.log('no uuid provided'), (a = 'WebUserNoID')),
                      a),
                      (function () {
                        var e = n().get('userSource');
                        return (
                          null == e &&
                            (console.log('no user source provided'),
                            (e = 'WebUserNoSource')),
                          e
                        );
                      })()
                    ),
                    Tt.linkAnalytics(this.analytics, this.dataURL),
                    Tt.setAssessmentType(i),
                    Tt.sendInit('v1.0.7', e.contentVersion),
                    this.game.Run(this);
                }),
                  yield this.registerServiceWorker(this.game);
              });
            })();
        });
      });
    }
    registerServiceWorker(e) {
      return Qt(this, void 0, void 0, function* () {
        console.log('Registering service worker...'),
          'serviceWorker' in navigator
            ? (new zt('./sw.js', {})
                .register()
                .then((e) => {
                  console.log('Service worker registered!'),
                    this.handleServiceWorkerRegistation(e);
                })
                .catch((e) => {
                  console.log('Service worker registration failed: ' + e);
                }),
              navigator.serviceWorker.addEventListener('message', Xt),
              yield navigator.serviceWorker.ready,
              console.log('Cache Model: '),
              console.log(this.cacheModel),
              null == localStorage.getItem(this.cacheModel.appName)
                ? (console.log('WE DONT HAVE THIS ASSESSMENT< CACHING IT!'),
                  (Kt.style.display = 'flex'),
                  Jt.postMessage({
                    command: 'Cache',
                    data: { appData: this.cacheModel },
                  }))
                : (Kt.style.display = 'none'),
              (Jt.onmessage = (e) => {
                console.log(e.data.command + ' received from service worker!'),
                  'Activated' == e.data.command &&
                    null == localStorage.getItem(this.cacheModel.appName) &&
                    Jt.postMessage({
                      command: 'Cache',
                      data: { appData: this.cacheModel },
                    });
              }))
            : console.warn(
                'Service workers are not supported in this browser.'
              );
      });
    }
    handleServiceWorkerRegistation(e) {
      var t;
      try {
        null === (t = null == e ? void 0 : e.installing) ||
          void 0 === t ||
          t.postMessage({ type: 'Registartion', value: this.lang });
      } catch (e) {
        console.log('Service worker registration failed: ' + e);
      }
    }
    GetDataURL() {
      return this.dataURL;
    }
  })();
  Yt.spinUp();
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TSxlQUNObkksTUFBT3JOLEtBQUtpMEIsT0FFWixNQUFPM0QsR0FDUi93QixRQUFRQyxJQUFJLHVDQUF5Qzh3QixHQUV2RCxDQUVPNkosYUFDTixPQUFPbjZCLEtBQUtnQixPQUNiLEdBZ0REa2YsR0FBSTZqQiIsInNvdXJjZXMiOlsid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2NvbXBvbmVudHMvdXJsVXRpbHMudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL2pzb25VdGlscy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL21hdGhVdGlscy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL3VpQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvdXRpbC9kaXN0L2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2NvbXBvbmVudC9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9sb2dnZXIvZGlzdC9lc20vaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9pZGIvYnVpbGQvd3JhcC1pZGItdmFsdWUuanMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL2luZGV4LmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hcHAvZGlzdC9lc20vaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvaW5zdGFsbGF0aW9ucy9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hbmFseXRpY3MvZGlzdC9lc20vaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9jb21wb25lbnRzL2FuYWx5dGljc0V2ZW50cy50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9CYXNlUXVpei50cyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9zdXJ2ZXkvc3VydmV5LnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2NvbXBvbmVudHMvdE5vZGUudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvYXNzZXNzbWVudC9hc3Nlc3NtZW50LnRzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vc3JjL2NvbXBvbmVudHMvdW5pdHlCcmlkZ2UudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9ub2RlX21vZHVsZXMvZmlyZWJhc2UvYXBwL2Rpc3QvaW5kZXguZXNtLmpzIiwid2VicGFjazovL2Fzc2Vzc21lbnQtc3VydmV5LWpzLy4vbm9kZV9tb2R1bGVzL3dvcmtib3gtd2luZG93L2J1aWxkL3dvcmtib3gtd2luZG93LnByb2QuZXM1Lm1qcyIsIndlYnBhY2s6Ly9hc3Nlc3NtZW50LXN1cnZleS1qcy8uL3NyYy9BcHAudHMiLCJ3ZWJwYWNrOi8vYXNzZXNzbWVudC1zdXJ2ZXktanMvLi9zcmMvY29tcG9uZW50cy9jYWNoZU1vZGVsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSByZXF1aXJlIHNjb3BlXG52YXIgX193ZWJwYWNrX3JlcXVpcmVfXyA9IHt9O1xuXG4iLCIvKipcbiAqIENvbnRhaW5zIHV0aWxzIGZvciB3b3JraW5nIHdpdGggVVJMIHN0cmluZ3MuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcFR5cGUoKTogc3RyaW5nIHtcblx0Y29uc3QgcGF0aFBhcmFtcyA9IGdldFBhdGhOYW1lKCk7XG5cdGNvbnN0IGFwcFR5cGUgPSBwYXRoUGFyYW1zLmdldCgnYXBwVHlwZScpO1xuXHRyZXR1cm4gYXBwVHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVVSUQoKTogc3RyaW5nIHtcblx0Y29uc3QgcGF0aFBhcmFtcyA9IGdldFBhdGhOYW1lKCk7XG5cdHZhciBudXVpZCA9IHBhdGhQYXJhbXMuZ2V0KCdjcl91c2VyX2lkJyk7XG5cdGlmIChudXVpZCA9PSB1bmRlZmluZWQpIHtcblx0XHRjb25zb2xlLmxvZyhcIm5vIHV1aWQgcHJvdmlkZWRcIik7XG5cdFx0bnV1aWQgPSBcIldlYlVzZXJOb0lEXCJcblx0fVxuXHRyZXR1cm4gbnV1aWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VyU291cmNlKCk6IHN0cmluZyB7XG5cdGNvbnN0IHBhdGhQYXJhbXMgPSBnZXRQYXRoTmFtZSgpO1xuXHR2YXIgbnV1aWQgPSBwYXRoUGFyYW1zLmdldCgndXNlclNvdXJjZScpO1xuXHRpZiAobnV1aWQgPT0gdW5kZWZpbmVkKSB7XG5cdFx0Y29uc29sZS5sb2coXCJubyB1c2VyIHNvdXJjZSBwcm92aWRlZFwiKTtcblx0XHRudXVpZCA9IFwiV2ViVXNlck5vU291cmNlXCJcblx0fVxuXHRyZXR1cm4gbnV1aWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhRmlsZSgpOiBzdHJpbmcge1xuXHRjb25zdCBwYXRoUGFyYW1zID0gZ2V0UGF0aE5hbWUoKTtcblx0dmFyIGRhdGEgPSBwYXRoUGFyYW1zLmdldCgnZGF0YScpO1xuXHRpZiAoZGF0YSA9PSB1bmRlZmluZWQpIHtcblx0XHRjb25zb2xlLmxvZyhcImRlZmF1bHQgZGF0YSBmaWxlXCIpO1xuXHRcdGRhdGEgPSBcInp1bHUtbGV0dGVyc291bmRzXCI7XG5cdFx0Ly9kYXRhID0gXCJzdXJ2ZXktenVsdVwiO1xuXHR9XG5cdHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRoTmFtZSgpIHtcblx0Y29uc3QgcXVlcnlTdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuXHRjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJ5U3RyaW5nKTtcblx0cmV0dXJuIHVybFBhcmFtcztcbn1cbiIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiLyoqIEpzb24gVXRpbHMgKi9cclxuXHJcbi8vIGltcG9ydCB7IHNldEZlZWRiYWNrVGV4dCB9IGZyb20gJy4vdWlDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEFwcERhdGEodXJsOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gbG9hZERhdGEodXJsKS50aGVuKGRhdGEgPT4geyByZXR1cm4gZGF0YTsgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmZXRjaEFwcFR5cGUodXJsOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gbG9hZERhdGEodXJsKS50aGVuKGRhdGEgPT4geyBcclxuXHRcdC8vIHNldEZlZWRiYWNrVGV4dChkYXRhW1wiZmVlZGJhY2tUZXh0XCJdKTsgXHJcblx0XHRyZXR1cm4gZGF0YVtcImFwcFR5cGVcIl07IFxyXG5cdH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hGZWVkYmFjayh1cmw6IHN0cmluZykge1xyXG5cdHJldHVybiBsb2FkRGF0YSh1cmwpLnRoZW4oZGF0YSA9PiB7IHJldHVybiBkYXRhW1wiZmVlZGJhY2tUZXh0XCJdOyB9KTtcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoU3VydmV5UXVlc3Rpb25zKHVybDogc3RyaW5nKSB7XHJcblx0cmV0dXJuIGxvYWREYXRhKHVybCkudGhlbihkYXRhID0+IHsgcmV0dXJuIGRhdGFbXCJxdWVzdGlvbnNcIl0gfSlcclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZldGNoQXNzZXNzbWVudEJ1Y2tldHModXJsOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gbG9hZERhdGEodXJsKS50aGVuKGRhdGEgPT4geyByZXR1cm4gZGF0YVtcImJ1Y2tldHNcIl0gfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGFVUkwodXJsOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gXCIvZGF0YS9cIiArIHVybCArIFwiLmpzb25cIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldENhc2VJbmRlcGVuZGVudExhbmdMaXN0KCkge1xyXG5cdHJldHVybiBbJ2x1Z2FuZGEnXTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gbG9hZERhdGEodXJsOiBzdHJpbmcpIHtcclxuXHR2YXIgZnVybCA9IGdldERhdGFVUkwodXJsKTtcclxuXHQvLyBjb25zb2xlLmxvZyhmdXJsKTtcclxuXHRyZXR1cm4gZmV0Y2goZnVybCkudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpO1xyXG59XHJcblxyXG5cclxuIiwiLy9jb2RlIGZvciBsb2FkaW5nIGF1ZGlvc1xuXG5pbXBvcnQgeyBxRGF0YSB9IGZyb20gJy4vcXVlc3Rpb25EYXRhJztcbmltcG9ydCB7IGJ1Y2tldCwgYnVja2V0SXRlbSB9IGZyb20gJy4uL2Fzc2Vzc21lbnQvYnVja2V0RGF0YSc7XG5pbXBvcnQgeyBnZXRDYXNlSW5kZXBlbmRlbnRMYW5nTGlzdCB9IGZyb20gJy4vanNvblV0aWxzJztcblxuZXhwb3J0IGNsYXNzIEF1ZGlvQ29udHJvbGxlciB7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQXVkaW9Db250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBwdWJsaWMgaW1hZ2VUb0NhY2hlOiBzdHJpbmdbXSA9IFtdO1xuICAgIHB1YmxpYyB3YXZUb0NhY2hlOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgcHVibGljIGFsbEF1ZGlvczogYW55ID0ge307XG4gICAgcHVibGljIGFsbEltYWdlczogYW55ID0ge307XG4gICAgcHVibGljIGRhdGFVUkw6IHN0cmluZyA9IFwiXCI7XG5cbiAgICBwcml2YXRlIGNvcnJlY3RTb3VuZFBhdGggPSBcImRpc3QvYXVkaW8vQ29ycmVjdC53YXZcIjtcblxuICAgIHByaXZhdGUgZmVlZGJhY2tBdWRpbzogYW55ID0gbnVsbDtcbiAgICBwcml2YXRlIGNvcnJlY3RBdWRpbzogYW55ID0gbnVsbDtcblxuICAgIHByaXZhdGUgaW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5mZWVkYmFja0F1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgICAgIHRoaXMuZmVlZGJhY2tBdWRpby5zcmMgPSB0aGlzLmNvcnJlY3RTb3VuZFBhdGg7XG4gICAgICAgIHRoaXMuY29ycmVjdEF1ZGlvID0gbmV3IEF1ZGlvKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBQcmVwYXJlQXVkaW9BbmRJbWFnZXNGb3JTdXJ2ZXkocXVlc3Rpb25zRGF0YTogcURhdGFbXSwgZGF0YVVSTDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRhdGFVUkwgPSBkYXRhVVJMO1xuICAgICAgICBjb25zdCBmZWVkYmFja1NvdW5kUGF0aCA9ICBcImF1ZGlvL1wiICsgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCArIFwiL2Fuc3dlcl9mZWVkYmFjay5tcDNcIjtcblxuICAgICAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS53YXZUb0NhY2hlLnB1c2goZmVlZGJhY2tTb3VuZFBhdGgpO1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5jb3JyZWN0QXVkaW8uc3JjID0gZmVlZGJhY2tTb3VuZFBhdGg7XG5cbiAgICAgICAgZm9yICh2YXIgcXVlc3Rpb25JbmRleCBpbiBxdWVzdGlvbnNEYXRhKXtcbiAgICAgICAgICAgIGxldCBxdWVzdGlvbkRhdGEgPSBxdWVzdGlvbnNEYXRhW3F1ZXN0aW9uSW5kZXhdO1xuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uRGF0YS5wcm9tcHRBdWRpbyAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLkZpbHRlckFuZEFkZEF1ZGlvVG9BbGxBdWRpb3MocXVlc3Rpb25EYXRhLnByb21wdEF1ZGlvLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocXVlc3Rpb25EYXRhLnByb21wdEltZyAhPSBudWxsICkge1xuICAgICAgICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5BZGRJbWFnZVRvQWxsSW1hZ2VzKHF1ZXN0aW9uRGF0YS5wcm9tcHRJbWcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBhbnN3ZXJJbmRleCBpbiBxdWVzdGlvbkRhdGEuYW5zd2Vycykge1xuICAgICAgICAgICAgICAgIGxldCBhbnN3ZXJEYXRhID0gcXVlc3Rpb25EYXRhLmFuc3dlcnNbYW5zd2VySW5kZXhdO1xuICAgICAgICAgICAgICAgIGlmIChhbnN3ZXJEYXRhLmFuc3dlckltZyAhPSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLkFkZEltYWdlVG9BbGxJbWFnZXMoYW5zd2VyRGF0YS5hbnN3ZXJJbWcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxBdWRpb3MpO1xuICAgICAgICBjb25zb2xlLmxvZyhBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxJbWFnZXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgQWRkSW1hZ2VUb0FsbEltYWdlcyhuZXdJbWFnZVVSTDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQWRkIGltYWdlOiBcIiArIG5ld0ltYWdlVVJMKTtcbiAgICAgICAgbGV0IG5ld0ltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgIG5ld0ltYWdlLnNyYyA9IG5ld0ltYWdlVVJMO1xuICAgICAgICBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxJbWFnZXNbbmV3SW1hZ2VVUkxdID0gbmV3SW1hZ2U7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBGaWx0ZXJBbmRBZGRBdWRpb1RvQWxsQXVkaW9zKG5ld0F1ZGlvVVJMOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJBZGRpbmcgYXVkaW86IFwiICsgbmV3QXVkaW9VUkwpO1xuICAgICAgICBpZiAobmV3QXVkaW9VUkwuaW5jbHVkZXMoXCIud2F2XCIpKXtcbiAgICAgICAgICAgIG5ld0F1ZGlvVVJMID0gbmV3QXVkaW9VUkwucmVwbGFjZShcIi53YXZcIiwgXCIubXAzXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKG5ld0F1ZGlvVVJMLmluY2x1ZGVzKFwiLm1wM1wiKSkge1xuICAgICAgICAgICAgLy8gQWxyZWFkeSBjb250YWlucyAubXAzIG5vdCBkb2luZyBhbnl0aGluZ1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3QXVkaW9VUkwgPSBuZXdBdWRpb1VSTC50cmltKCkgKyBcIi5tcDNcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmlsdGVyZWQ6IFwiICsgbmV3QXVkaW9VUkwpO1xuICAgICAgIFxuICAgICAgICBsZXQgbmV3QXVkaW8gPSBuZXcgQXVkaW8oKTtcbiAgICAgICAgaWYoZ2V0Q2FzZUluZGVwZW5kZW50TGFuZ0xpc3QoKS5pbmNsdWRlcyhBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMLnNwbGl0KCctJylbMF0pICApXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5ld0F1ZGlvLnNyYyA9IFwiYXVkaW8vXCIgKyBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5kYXRhVVJMICsgXCIvXCIgKyBuZXdBdWRpb1VSTDtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBuZXdBdWRpby5zcmMgPSBcImF1ZGlvL1wiICsgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCArIFwiL1wiICsgbmV3QXVkaW9VUkw7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsQXVkaW9zW25ld0F1ZGlvVVJMXSA9IG5ld0F1ZGlvO1xuICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2cobmV3QXVkaW8uc3JjKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIFByZWxvYWRCdWNrZXQobmV3QnVja2V0OiBidWNrZXQsIGRhdGFVUkwpIHtcbiAgICAgICAgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCA9IGRhdGFVUkw7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmNvcnJlY3RBdWRpby5zcmMgPSBcImF1ZGlvL1wiICsgQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuZGF0YVVSTCArIFwiL2Fuc3dlcl9mZWVkYmFjay5tcDNcIjtcbiAgICAgICAgZm9yICh2YXIgaXRlbUluZGV4IGluIG5ld0J1Y2tldC5pdGVtcyl7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ld0J1Y2tldC5pdGVtc1tpdGVtSW5kZXhdO1xuICAgICAgICAgICAgQXVkaW9Db250cm9sbGVyLkZpbHRlckFuZEFkZEF1ZGlvVG9BbGxBdWRpb3MoaXRlbS5pdGVtTmFtZS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgUGxheUF1ZGlvKGF1ZGlvTmFtZTogc3RyaW5nLCBmaW5pc2hlZENhbGxiYWNrPzogRnVuY3Rpb24sIGF1ZGlvQW5pbT86IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIGF1ZGlvTmFtZSA9IGF1ZGlvTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcInRyeWluZyB0byBwbGF5IFwiICsgYXVkaW9OYW1lKTtcbiAgICAgICAgaWYgKGF1ZGlvTmFtZS5pbmNsdWRlcyhcIi5tcDNcIikpe1xuICAgICAgICAgICAgaWYgKGF1ZGlvTmFtZS5zbGljZSgtNCkgIT0gXCIubXAzXCIpe1xuICAgICAgICAgICAgICAgIGF1ZGlvTmFtZSA9IGF1ZGlvTmFtZS50cmltKCkgKyBcIi5tcDNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF1ZGlvTmFtZSA9IGF1ZGlvTmFtZS50cmltKCkgKyBcIi5tcDNcIjtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcIlByZSBwbGF5IGFsbCBhdWRpb3M6IFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coQXVkaW9Db250cm9sbGVyLmdldEluc3RhbmNlKCkuYWxsQXVkaW9zKTtcbiAgICBcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHBsYXlQcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXVkaW8gPSBBdWRpb0NvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbGxBdWRpb3NbYXVkaW9OYW1lXTtcbiAgICAgICAgICAgIGlmIChhdWRpbykge1xuICAgICAgICAgICAgICAgIGF1ZGlvLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mKGF1ZGlvQW5pbSkgIT09ICd1bmRlZmluZWQnID8gYXVkaW9BbmltKHRydWUpIDogbnVsbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICBhdWRpby5hZGRFdmVudExpc3RlbmVyKFwiZW5kZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlb2YoYXVkaW9BbmltKSAhPT0gJ3VuZGVmaW5lZCcgPyBhdWRpb0FuaW0oZmFsc2UpIDogbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyBcbiAgICAgICAgICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgICAgICAgICBhdWRpby5wbGF5KCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwbGF5aW5nIGF1ZGlvOlwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiQXVkaW8gZmlsZSBub3QgZm91bmQ6XCIsIGF1ZGlvTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpOyBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgXG4gICAgICAgIFxuICAgICAgICBwbGF5UHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHR5cGVvZihmaW5pc2hlZENhbGxiYWNrKSAhPT0gJ3VuZGVmaW5lZCcgPyBmaW5pc2hlZENhbGxiYWNrKCkgOiBudWxsO1xuICAgICAgICB9KS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUHJvbWlzZSBlcnJvcjpcIiwgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgXG5cbiAgICBwdWJsaWMgc3RhdGljIEdldEltYWdlKGltYWdlTmFtZTogc3RyaW5nKTogYW55IHtcbiAgICAgICAgcmV0dXJuIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFsbEltYWdlc1tpbWFnZU5hbWVdO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgUGxheURpbmcoKTogdm9pZCB7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQXVkaW8ucGxheSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgUGxheUNvcnJlY3QoKTogdm9pZCB7XG4gICAgICAgIEF1ZGlvQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmNvcnJlY3RBdWRpby5wbGF5KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBBdWRpb0NvbnRyb2xsZXIge1xuICAgICAgICBpZiAoQXVkaW9Db250cm9sbGVyLmluc3RhbmNlID09IG51bGwpIHtcbiAgICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5pbnN0YW5jZSA9IG5ldyBBdWRpb0NvbnRyb2xsZXIoKTtcbiAgICAgICAgICAgIEF1ZGlvQ29udHJvbGxlci5pbnN0YW5jZS5pbml0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gQXVkaW9Db250cm9sbGVyLmluc3RhbmNlO1xuICAgIH1cbn0iLCJcclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRGcm9tKGFycmF5KSB7XHJcblx0cmV0dXJuIGFycmF5W01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGFycmF5Lmxlbmd0aCldXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlQXJyYXkoYXJyYXkpIHtcclxuXHRmb3IgKGxldCBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG5cdFx0Y29uc3QgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xyXG5cdFx0W2FycmF5W2ldLCBhcnJheVtqXV0gPSBbYXJyYXlbal0sIGFycmF5W2ldXTtcclxuXHR9XHJcbn1cclxuIiwiaW1wb3J0IHsgcURhdGEsIGFuc3dlckRhdGEgfSBmcm9tICcuL3F1ZXN0aW9uRGF0YSc7XHJcbmltcG9ydCB7IEF1ZGlvQ29udHJvbGxlciB9IGZyb20gJy4vYXVkaW9Db250cm9sbGVyJztcclxuaW1wb3J0IHsgcmFuZEZyb20sIHNodWZmbGVBcnJheSB9IGZyb20gJy4vbWF0aFV0aWxzJztcclxuaW1wb3J0IHsgZ2V0RGF0YUZpbGUgfSBmcm9tICcuL3VybFV0aWxzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBVSUNvbnRyb2xsZXIge1xyXG5cclxuXHRwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogVUlDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG5cdHByaXZhdGUgbGFuZGluZ0NvbnRhaW5lcklkID0gXCJsYW5kV3JhcFwiO1xyXG5cdHB1YmxpYyBsYW5kaW5nQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcblx0cHJpdmF0ZSBnYW1lQ29udGFpbmVySWQgPSBcImdhbWVXcmFwXCI7XHJcblx0cHVibGljIGdhbWVDb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuXHRwcml2YXRlIGVuZENvbnRhaW5lcklkID0gXCJlbmRXcmFwXCI7XHJcblx0cHVibGljIGVuZENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdHByaXZhdGUgc3RhckNvbnRhaW5lcklkID0gXCJzdGFyV3JhcHBlclwiO1xyXG5cdHB1YmxpYyBzdGFyQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcblx0cHJpdmF0ZSBjaGVzdENvbnRhaW5lcklkID0gJ2NoZXN0V3JhcHBlcic7XHJcblx0cHVibGljIGNoZXN0Q29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcblx0cHJpdmF0ZSBxdWVzdGlvbnNDb250YWluZXJJZCA9IFwicVdyYXBcIjtcclxuXHRwdWJsaWMgcXVlc3Rpb25zQ29udGFpbmVyOiBIVE1MRWxlbWVudDtcclxuXHJcblx0cHJpdmF0ZSBmZWVkYmFja0NvbnRhaW5lcklkID0gXCJmZWVkYmFja1dyYXBcIjtcclxuXHRwdWJsaWMgZmVlZGJhY2tDb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuXHRwcml2YXRlIGFuc3dlcnNDb250YWluZXJJZCA9IFwiYVdyYXBcIjtcclxuXHRwdWJsaWMgYW5zd2Vyc0NvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdHByaXZhdGUgYW5zd2VyQnV0dG9uMUlkID0gXCJhbnN3ZXJCdXR0b24xXCI7XHJcblx0cHJpdmF0ZSBhbnN3ZXJCdXR0b24xOiBIVE1MRWxlbWVudDtcclxuXHRwcml2YXRlIGFuc3dlckJ1dHRvbjJJZCA9IFwiYW5zd2VyQnV0dG9uMlwiO1xyXG5cdHByaXZhdGUgYW5zd2VyQnV0dG9uMjogSFRNTEVsZW1lbnQ7XHJcblx0cHJpdmF0ZSBhbnN3ZXJCdXR0b24zSWQgPSBcImFuc3dlckJ1dHRvbjNcIjtcclxuXHRwcml2YXRlIGFuc3dlckJ1dHRvbjM6IEhUTUxFbGVtZW50O1xyXG5cdHByaXZhdGUgYW5zd2VyQnV0dG9uNElkID0gXCJhbnN3ZXJCdXR0b240XCI7XHJcblx0cHJpdmF0ZSBhbnN3ZXJCdXR0b240OiBIVE1MRWxlbWVudDtcclxuXHRwcml2YXRlIGFuc3dlckJ1dHRvbjVJZCA9IFwiYW5zd2VyQnV0dG9uNVwiO1xyXG5cdHByaXZhdGUgYW5zd2VyQnV0dG9uNTogSFRNTEVsZW1lbnQ7XHJcblx0cHJpdmF0ZSBhbnN3ZXJCdXR0b242SWQgPSBcImFuc3dlckJ1dHRvbjZcIjtcclxuXHRwcml2YXRlIGFuc3dlckJ1dHRvbjY6IEhUTUxFbGVtZW50O1xyXG5cclxuXHJcblx0cHJpdmF0ZSBwbGF5QnV0dG9uSWQgPSBcInBidXR0b25cIjtcclxuXHRwcml2YXRlIHBsYXlCdXR0b246IEhUTUxFbGVtZW50O1xyXG5cclxuXHRwcml2YXRlIGNoZXN0SW1nSWQgPSBcImNoZXN0SW1hZ2VcIjtcclxuXHRwcml2YXRlIGNoZXN0SW1nOiBIVE1MRWxlbWVudDtcclxuXHJcblx0cHVibGljIG5leHRRdWVzdGlvbiA9IG51bGw7XHJcblxyXG5cdHByaXZhdGUgY29udGVudExvYWRlZCA9IGZhbHNlO1xyXG5cclxuXHRwdWJsaWMgcVN0YXJ0O1xyXG5cdHB1YmxpYyBzaG93biA9IGZhbHNlO1xyXG5cclxuXHRwdWJsaWMgc3RhcnMgPSBbXTtcclxuXHRwdWJsaWMgc2hvd25TdGFyc0NvdW50ID0gMDtcclxuXHRwdWJsaWMgc3RhclBvc2l0aW9uczogQXJyYXk8eyB4OiBudW1iZXIsIHk6IG51bWJlciB9PiA9IEFycmF5PHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfT4oKTtcclxuXHRwdWJsaWMgcUFuc051bSA9IDA7XHJcblxyXG5cdHB1YmxpYyBhbGxTdGFydDogbnVtYmVyO1xyXG5cclxuXHRwdWJsaWMgYnV0dG9ucyA9IFtdO1xyXG5cclxuXHRwcml2YXRlIGJ1dHRvblByZXNzQ2FsbGJhY2s6IEZ1bmN0aW9uO1xyXG5cdHByaXZhdGUgc3RhcnRQcmVzc0NhbGxiYWNrOiBGdW5jdGlvbjtcclxuXHJcblx0cHVibGljIGJ1dHRvbnNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHJpdmF0ZSBkZXZNb2RlQ29ycmVjdExhYmVsVmlzaWJpbGl0eTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuXHRwcml2YXRlIGluaXQoKTogdm9pZCB7XHJcblx0XHQvLyBJbml0aWFsaXplIHJlcXVpcmVkIGNvbnRhaW5lcnNcclxuXHRcdHRoaXMubGFuZGluZ0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubGFuZGluZ0NvbnRhaW5lcklkKTtcclxuXHRcdHRoaXMuZ2FtZUNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2FtZUNvbnRhaW5lcklkKTtcclxuXHRcdHRoaXMuZW5kQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5lbmRDb250YWluZXJJZCk7XHJcblx0XHR0aGlzLnN0YXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnN0YXJDb250YWluZXJJZCk7XHJcblx0XHR0aGlzLmNoZXN0Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jaGVzdENvbnRhaW5lcklkKTtcclxuXHRcdHRoaXMucXVlc3Rpb25zQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5xdWVzdGlvbnNDb250YWluZXJJZCk7XHJcblx0XHR0aGlzLmZlZWRiYWNrQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5mZWVkYmFja0NvbnRhaW5lcklkKTtcclxuXHRcdHRoaXMuYW5zd2Vyc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2Vyc0NvbnRhaW5lcklkKTtcclxuXHJcblx0XHQvLyBJbml0aWFsaXplIHJlcXVpcmVkIGJ1dHRvbnNcclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uMUlkKTtcclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uMklkKTtcclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uMyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uM0lkKTtcclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uNCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNElkKTtcclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uNSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNUlkKTtcclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uNiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuYW5zd2VyQnV0dG9uNklkKTtcclxuXHJcblx0XHR0aGlzLnBsYXlCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnBsYXlCdXR0b25JZCk7XHJcblxyXG5cdFx0dGhpcy5jaGVzdEltZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY2hlc3RJbWdJZCk7XHJcblxyXG5cdFx0dGhpcy5pbml0aWFsaXplU3RhcnMoKTtcclxuXHJcblx0XHR0aGlzLmluaXRFdmVudExpc3RlbmVycygpO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBpbml0aWFsaXplU3RhcnMoKTogdm9pZCB7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDIwOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgbmV3U3RhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcblxyXG5cdFx0XHQvLyBuZXdTdGFyLnNyYyA9IFwiaW1nL3N0YXIucG5nXCI7XHJcblx0XHRcdG5ld1N0YXIuaWQgPSBcInN0YXJcIiArIGk7XHJcblxyXG5cdFx0XHRuZXdTdGFyLmNsYXNzTGlzdC5hZGQoXCJ0b3BzdGFydlwiKTtcclxuXHJcblx0XHRcdHRoaXMuc3RhckNvbnRhaW5lci5hcHBlbmRDaGlsZChuZXdTdGFyKTtcclxuXHJcblx0XHRcdHRoaXMuc3RhckNvbnRhaW5lci5pbm5lckhUTUwgKz0gXCJcIjtcclxuXHJcblx0XHRcdGlmIChpID09IDkpIHtcclxuXHRcdFx0XHR0aGlzLnN0YXJDb250YWluZXIuaW5uZXJIVE1MICs9IFwiPGJyPlwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnN0YXJzLnB1c2goaSk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2h1ZmZsZUFycmF5KHRoaXMuc3RhcnMpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIFNldENvcnJlY3RMYWJlbFZpc2liaWxpdHkodmlzaWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG5cdFx0dGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsVmlzaWJpbGl0eSA9IHZpc2libGU7XHJcblx0XHRjb25zb2xlLmxvZyhcIkNvcnJlY3QgbGFiZWwgdmlzaWJpbGl0eSBzZXQgdG8gXCIsIHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFZpc2liaWxpdHkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBPdmVybGFwcGluZ090aGVyU3RhcnMoc3RhclBvc2l0aW9uczogQXJyYXk8eyB4OiBudW1iZXIsIHk6IG51bWJlciB9PiwgeDogbnVtYmVyLCB5OiBudW1iZXIsIG1pbkRpc3RhbmNlOiBudW1iZXIpOiBib29sZWFuIHtcclxuXHRcdGlmIChzdGFyUG9zaXRpb25zLmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJQb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0Y29uc3QgZHggPSBzdGFyUG9zaXRpb25zW2ldLnggLSB4O1xyXG5cdFx0XHRjb25zdCBkeSA9IHN0YXJQb3NpdGlvbnNbaV0ueSAtIHk7XHJcblx0XHRcdGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxuXHRcdFx0aWYgKGRpc3RhbmNlIDwgbWluRGlzdGFuY2UpIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHJpdmF0ZSBpbml0RXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XHJcblx0XHQvLyBUT0RPOiByZWZhY3RvciB0aGlzXHJcblx0XHR0aGlzLmFuc3dlckJ1dHRvbjEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuXHRcdFx0dGhpcy5hbnN3ZXJCdXR0b25QcmVzcygxKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uMSk7XHJcblxyXG5cdFx0dGhpcy5hbnN3ZXJCdXR0b24yLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoMik7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjIpO1xyXG5cclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uMy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmFuc3dlckJ1dHRvblByZXNzKDMpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b24zKTtcclxuXHJcblx0XHR0aGlzLmFuc3dlckJ1dHRvbjQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuXHRcdFx0dGhpcy5hbnN3ZXJCdXR0b25QcmVzcyg0KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMuYnV0dG9ucy5wdXNoKHRoaXMuYW5zd2VyQnV0dG9uNCk7XHJcblxyXG5cdFx0dGhpcy5hbnN3ZXJCdXR0b241LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuYW5zd2VyQnV0dG9uUHJlc3MoNSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLmJ1dHRvbnMucHVzaCh0aGlzLmFuc3dlckJ1dHRvbjUpO1xyXG5cclxuXHRcdHRoaXMuYW5zd2VyQnV0dG9uNi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLmFuc3dlckJ1dHRvblByZXNzKDYpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5idXR0b25zLnB1c2godGhpcy5hbnN3ZXJCdXR0b242KTtcclxuXHJcblx0XHR0aGlzLmxhbmRpbmdDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuXHRcdFx0aWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGdldERhdGFGaWxlKCkpKSB7XHJcblx0XHRcdFx0dGhpcy5zaG93R2FtZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2hvd09wdGlvbnMoKTogdm9pZCB7XHJcblx0XHRpZiAoIVVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3duKSB7XHJcblx0XHRcdGNvbnN0IG5ld1EgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5uZXh0UXVlc3Rpb247XHJcblx0XHRcdGNvbnN0IGJ1dHRvbnMgPSBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zO1xyXG5cclxuXHRcdFx0bGV0IGFuaW1hdGlvbkR1cmF0aW9uID0gMjIwO1xyXG5cdFx0XHRjb25zdCBkZWxheUJmb3JlT3B0aW9uID0gMTUwO1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93biA9IHRydWU7XHJcblx0XHRcdGxldCBvcHRpb25zRGlzcGxheWVkID0gMDtcclxuXHJcblx0XHRcdGJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4ge1xyXG5cdFx0XHRcdGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHRcdFx0XHRidXR0b24uc3R5bGUuYW5pbWF0aW9uID0gXCJcIjtcclxuXHRcdFx0XHRidXR0b24uaW5uZXJIVE1MID0gXCJcIjtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IG5ld1EuYW5zd2Vycy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0Y29uc3QgY3VyQW5zd2VyID0gbmV3US5hbnN3ZXJzW2ldO1xyXG5cdFx0XHRcdFx0Y29uc3QgYnV0dG9uID0gYnV0dG9uc1tpXSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcblx0XHRcdFx0XHRjb25zdCBpc0NvcnJlY3QgPSBjdXJBbnN3ZXIuYW5zd2VyTmFtZSA9PT0gbmV3US5jb3JyZWN0O1xyXG5cclxuXHRcdFx0XHRcdGJ1dHRvbi5pbm5lckhUTUwgPSAnYW5zd2VyVGV4dCcgaW4gY3VyQW5zd2VyID8gY3VyQW5zd2VyLmFuc3dlclRleHQgOiAnJztcdFxyXG5cclxuXHRcdFx0XHRcdC8vIEFkZCBhIGxhYmVsIGluc2lkZSB0aGUgYnV0dG9uIHRvIHNob3cgdGhlIGNvcnJlY3QgYW5zd2VyXHJcblx0XHRcdFx0XHRpZiAoaXNDb3JyZWN0ICYmIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmRldk1vZGVDb3JyZWN0TGFiZWxWaXNpYmlsaXR5KSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0IGNvcnJlY3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblx0XHRcdFx0XHRcdGNvcnJlY3RMYWJlbC5jbGFzc0xpc3QuYWRkKFwiY29ycmVjdC1sYWJlbFwiKTtcclxuXHRcdFx0XHRcdFx0Y29ycmVjdExhYmVsLmlubmVySFRNTCA9IFwiQ29ycmVjdFwiO1xyXG5cdFx0XHRcdFx0XHRidXR0b24uYXBwZW5kQ2hpbGQoY29ycmVjdExhYmVsKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHRcdFx0XHRcdGJ1dHRvbi5zdHlsZS5ib3hTaGFkb3cgPSBcIjBweCAwcHggMHB4IDBweCByZ2JhKDAsMCwwLDApXCI7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0YnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSBcInZpc2libGVcIjtcclxuXHRcdFx0XHRcdFx0YnV0dG9uLnN0eWxlLmJveFNoYWRvdyA9IFwiMHB4IDZweCA4cHggIzYwNjA2MFwiO1xyXG5cdFx0XHRcdFx0XHRidXR0b24uc3R5bGUuYW5pbWF0aW9uID0gYHpvb21JbiAke2FuaW1hdGlvbkR1cmF0aW9ufW1zIGVhc2UgZm9yd2FyZHNgO1xyXG5cdFx0XHRcdFx0XHRpZiAoJ2Fuc3dlckltZycgaW4gY3VyQW5zd2VyKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgdG1waW1nID0gQXVkaW9Db250cm9sbGVyLkdldEltYWdlKGN1ckFuc3dlci5hbnN3ZXJJbWcpO1xyXG5cdFx0XHRcdFx0XHRcdGJ1dHRvbi5hcHBlbmRDaGlsZCh0bXBpbWcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdhbmltYXRpb25lbmQnLCAoKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0b3B0aW9uc0Rpc3BsYXllZCsrO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChvcHRpb25zRGlzcGxheWVkID09PSBuZXdRLmFuc3dlcnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5lbmFibGVBbnN3ZXJCdXR0b24oKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSwgKGkgKiBhbmltYXRpb25EdXJhdGlvbikgKiAwLjMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sIGRlbGF5QmZvcmVPcHRpb24pXHJcblxyXG5cclxuXHRcdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucVN0YXJ0ID0gRGF0ZS5ub3coKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHByaXZhdGUgZW5hYmxlQW5zd2VyQnV0dG9uKCk6IHZvaWQge1xyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9uc0FjdGl2ZSA9IHRydWU7XHJcblx0fVxyXG5cdHB1YmxpYyBzdGF0aWMgU2V0RmVlZGJhY2tUZXh0KG50OiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdGNvbnNvbGUubG9nKFwiRmVlZGJhY2sgdGV4dCBzZXQgdG8gXCIgKyBudCk7XHJcblx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5pbm5lckhUTUwgPSBudDtcclxuXHR9XHJcblxyXG5cdC8vZnVuY3Rpb25zIHRvIHNob3cvaGlkZSB0aGUgZGlmZmVyZW50IGNvbnRhaW5lcnNcclxuXHRwcml2YXRlIHNob3dMYW5kaW5nKCk6IHZvaWQge1xyXG5cdFx0dGhpcy5sYW5kaW5nQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuXHRcdHRoaXMuZ2FtZUNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0XHR0aGlzLmVuZENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIFNob3dFbmQoKTogdm9pZCB7XHJcblx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5sYW5kaW5nQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmdhbWVDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuZW5kQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxuXHR9XHJcblxyXG5cdHByaXZhdGUgc2hvd0dhbWUoKTogdm9pZCB7XHJcblx0XHR0aGlzLmxhbmRpbmdDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0dGhpcy5nYW1lQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcImdyaWRcIjtcclxuXHRcdHRoaXMuZW5kQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdHRoaXMuYWxsU3RhcnQgPSBEYXRlLm5vdygpO1xyXG5cdFx0dGhpcy5zdGFydFByZXNzQ2FsbGJhY2soKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgU2V0RmVlZGJhY2tWaXNpYmlsZSh2aXNpYmxlOiBib29sZWFuKSB7XHJcblx0XHRpZiAodmlzaWJsZSkge1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwidmlzaWJsZVwiKTtcclxuXHRcdFx0QXVkaW9Db250cm9sbGVyLlBsYXlDb3JyZWN0KCk7XHJcblx0XHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNBY3RpdmUgPSBmYWxzZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmZlZWRiYWNrQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJ2aXNpYmxlXCIpO1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5mZWVkYmFja0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zQWN0aXZlID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIFJlYWR5Rm9yTmV4dChuZXdROiBxRGF0YSk6IHZvaWQge1xyXG5cdFx0aWYgKG5ld1EgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coXCJyZWFkeSBmb3IgbmV4dCFcIik7XHJcblx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5hbnN3ZXJzQ29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xyXG5cdFx0Zm9yICh2YXIgYiBpbiBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zKSB7XHJcblx0XHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvbnNbYl0uc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XHJcblx0XHR9XHJcblx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93biA9IGZhbHNlO1xyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubmV4dFF1ZXN0aW9uID0gbmV3UTtcclxuXHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnF1ZXN0aW9uc0NvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucXVlc3Rpb25zQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdC8vIHBCLmlubmVySFRNTCA9IFwiPGJ1dHRvbiBpZD0nbmV4dHFCdXR0b24nPjxzdmcgd2lkdGg9JzI0JyBoZWlnaHQ9JzI0JyB2aWV3Qm94PScwIDAgMjQgMjQnIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZD0nTTkgMThMMTUgMTJMOSA2VjE4WicgZmlsbD0nY3VycmVudENvbG9yJyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLXdpZHRoPScyJyBzdHJva2UtbGluZWNhcD0ncm91bmQnIHN0cm9rZS1saW5lam9pbj0ncm91bmQnPjwvcGF0aD48L3N2Zz48L2J1dHRvbj5cIjtcclxuXHRcdC8vIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZChcImF1ZGlvLWJ1dHRvblwiKTtcclxuXHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnBsYXlCdXR0b24uaW5uZXJIVE1MID0gXCI8YnV0dG9uIGlkPSduZXh0cUJ1dHRvbic+PGltZyBjbGFzcz1hdWRpby1idXR0b24gd2lkdGg9JzEwMHB4JyBoZWlnaHQ9JzEwMHB4JyBzcmM9Jy9pbWcvU291bmRCdXR0b25fSWRsZS5wbmcnIHR5cGU9J2ltYWdlL3N2Zyt4bWwnPiA8L2ltZz48L2J1dHRvbj5cIjtcclxuXHRcdHZhciBuZXh0UXVlc3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHRxQnV0dG9uXCIpO1xyXG5cdFx0bmV4dFF1ZXN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFVJQ29udHJvbGxlci5TaG93UXVlc3Rpb24oKTtcclxuXHRcdFx0Ly9wbGF5cXVlc3Rpb25hdWRpb1xyXG5cdFx0XHRBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKG5ld1EucHJvbXB0QXVkaW8sIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3dPcHRpb25zLCBVSUNvbnRyb2xsZXIuU2hvd0F1ZGlvQW5pbWF0aW9uKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBTaG93QXVkaW9BbmltYXRpb24ocGxheWluZzogYm9vbGVhbiA9IGZhbHNlKSB7XHJcblx0XHRjb25zdCBwbGF5QnV0dG9uSW1nID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucGxheUJ1dHRvbi5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcclxuXHRcdGlmIChwbGF5aW5nKSB7XHJcblx0XHRcdHBsYXlCdXR0b25JbWcuc3JjID0gJ2FuaW1hdGlvbi9Tb3VuZEJ1dHRvbi5naWYnO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdHBsYXlCdXR0b25JbWcuc3JjID0gJy9pbWcvU291bmRCdXR0b25fSWRsZS5wbmcnO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHRwdWJsaWMgc3RhdGljIFNob3dRdWVzdGlvbihuZXdRdWVzdGlvbj86IHFEYXRhKTogdm9pZCB7XHJcblxyXG5cdFx0Ly8gcEIuaW5uZXJIVE1MID0gXCI8YnV0dG9uIGlkPSduZXh0cUJ1dHRvbic+PHN2ZyB3aWR0aD0nMjQnIGhlaWdodD0nMjQnIHZpZXdCb3g9JzAgMCAyNCAyNCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNOSAxOEwxNSAxMkw5IDZWMThaJyBmaWxsPSdjdXJyZW50Q29sb3InIHN0cm9rZT0nY3VycmVudENvbG9yJyBzdHJva2Utd2lkdGg9JzInIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCc+PC9wYXRoPjwvc3ZnPjwvYnV0dG9uPlwiO1xyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucGxheUJ1dHRvbi5pbm5lckhUTUwgPSBcIjxidXR0b24gaWQ9J25leHRxQnV0dG9uJz48aW1nIGNsYXNzPWF1ZGlvLWJ1dHRvbiB3aWR0aD0nMTAwcHgnIGhlaWdodD0nMTAwcHgnIHNyYz0nL2ltZy9Tb3VuZEJ1dHRvbl9JZGxlLnBuZycgdHlwZT0naW1hZ2Uvc3ZnK3htbCc+IDwvaW1nPjwvYnV0dG9uPlwiO1xyXG5cclxuXHRcdHZhciBuZXh0UXVlc3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5leHRxQnV0dG9uXCIpO1xyXG5cdFx0bmV4dFF1ZXN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwibmV4dCBxdWVzdGlvbiBidXR0b24gcHJlc3NlZFwiKTtcclxuXHRcdFx0Y29uc29sZS5sb2cobmV3UXVlc3Rpb24ucHJvbXB0QXVkaW8pO1xyXG5cclxuXHRcdFx0aWYgKCdwcm9tcHRBdWRpbycgaW4gbmV3UXVlc3Rpb24pIHtcclxuXHRcdFx0XHRBdWRpb0NvbnRyb2xsZXIuUGxheUF1ZGlvKG5ld1F1ZXN0aW9uLnByb21wdEF1ZGlvLCB1bmRlZmluZWQsIFVJQ29udHJvbGxlci5TaG93QXVkaW9BbmltYXRpb24pO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cclxuXHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmFuc3dlcnNDb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG5cclxuXHRcdGxldCBxQ29kZSA9IFwiXCI7XHJcblxyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucXVlc3Rpb25zQ29udGFpbmVyLmlubmVySFRNTCA9IFwiXCI7XHJcblxyXG5cdFx0aWYgKHR5cGVvZiAobmV3UXVlc3Rpb24pID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdG5ld1F1ZXN0aW9uID0gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkubmV4dFF1ZXN0aW9uO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgncHJvbXB0SW1nJyBpbiBuZXdRdWVzdGlvbikge1xyXG5cdFx0XHR2YXIgdG1waW1nID0gQXVkaW9Db250cm9sbGVyLkdldEltYWdlKG5ld1F1ZXN0aW9uLnByb21wdEltZyk7XHJcblx0XHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnF1ZXN0aW9uc0NvbnRhaW5lci5hcHBlbmRDaGlsZCh0bXBpbWcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHFDb2RlICs9IG5ld1F1ZXN0aW9uLnByb21wdFRleHQ7XHJcblxyXG5cdFx0cUNvZGUgKz0gXCI8QlI+XCI7XHJcblxyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkucXVlc3Rpb25zQ29udGFpbmVyLmlubmVySFRNTCArPSBxQ29kZTtcclxuXHJcblxyXG5cdFx0Zm9yICh2YXIgYnV0dG9uSW5kZXggaW4gVUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuYnV0dG9ucykge1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5idXR0b25zW2J1dHRvbkluZGV4XS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgQWRkU3RhcigpOiB2b2lkIHtcclxuXHRcdHZhciBzdGFyVG9TaG93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFyXCIgKyBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zdGFyc1tVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xQW5zTnVtXSkgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuXHRcdHN0YXJUb1Nob3cuc3JjID0gJy4uL2FuaW1hdGlvbi9TdGFyLmdpZic7XHJcblx0XHRzdGFyVG9TaG93LmNsYXNzTGlzdC5hZGQoXCJ0b3BzdGFydlwiKTtcclxuXHRcdHN0YXJUb1Nob3cuY2xhc3NMaXN0LnJlbW92ZShcInRvcHN0YXJoXCIpO1xyXG5cclxuXHRcdHN0YXJUb1Nob3cuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcblxyXG5cdFx0bGV0IGNvbnRhaW5lcldpZHRoID0gVUlDb250cm9sbGVyLmluc3RhbmNlLnN0YXJDb250YWluZXIub2Zmc2V0V2lkdGg7XHJcblx0XHRsZXQgY29udGFpbmVySGVpZ2h0ID0gVUlDb250cm9sbGVyLmluc3RhbmNlLnN0YXJDb250YWluZXIub2Zmc2V0SGVpZ2h0O1xyXG5cclxuXHRcdGNvbnNvbGUubG9nKFwiU3RhcnMgQ29udGFpbmVyIGRpbWVuc2lvbnM6IFwiLCBjb250YWluZXJXaWR0aCwgY29udGFpbmVySGVpZ2h0KTtcclxuXHJcblx0XHRsZXQgcmFuZG9tWCA9IDA7XHJcblx0XHRsZXQgcmFuZG9tWSA9IDA7XHJcblxyXG5cdFx0ZG8ge1xyXG5cdFx0XHRyYW5kb21YID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGNvbnRhaW5lcldpZHRoIC0gNjApKTtcclxuXHRcdFx0cmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNvbnRhaW5lckhlaWdodCk7XHJcblx0XHR9IHdoaWxlIChVSUNvbnRyb2xsZXIuT3ZlcmxhcHBpbmdPdGhlclN0YXJzKFVJQ29udHJvbGxlci5pbnN0YW5jZS5zdGFyUG9zaXRpb25zLCByYW5kb21YLCByYW5kb21ZLCAzMCkpO1xyXG5cclxuXHRcdC8vIFNhdmUgdGhlc2UgcmFuZG9tIHggYW5kIHkgdmFsdWVzLCBtYWtlIHRoZSBzdGFyIGFwcGVhciBpbiB0aGUgY2VudGVyIG9mIHRoZSBzY3JlZW4sIG1ha2UgaXQgMyB0aW1lcyBiaWdnZXIgdXNpbmcgc2NhbGUgYW5kIHNsb3dseSB0cmFuc2l0aW9uIHRvIHRoZSByYW5kb20geCBhbmQgeSB2YWx1ZXNcclxuXHRcdHN0YXJUb1Nob3cuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgxMClcIjtcclxuXHRcdHN0YXJUb1Nob3cuc3R5bGUudHJhbnNpdGlvbiA9IFwidG9wIDFzIGVhc2UsIGxlZnQgMXMgZWFzZSwgdHJhbnNmb3JtIDAuNXMgZWFzZVwiO1xyXG5cdFx0c3RhclRvU2hvdy5zdHlsZS56SW5kZXggPSBcIjUwMFwiO1xyXG5cdFx0c3RhclRvU2hvdy5zdHlsZS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyICsgXCJweFwiO1xyXG5cdFx0c3RhclRvU2hvdy5zdHlsZS5sZWZ0ID0gVUlDb250cm9sbGVyLmluc3RhbmNlLmdhbWVDb250YWluZXIub2Zmc2V0V2lkdGggLyAyIC0gKHN0YXJUb1Nob3cub2Zmc2V0V2lkdGggLyAyKSArIFwicHhcIjtcclxuXHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0c3RhclRvU2hvdy5zdHlsZS50cmFuc2l0aW9uID0gXCJ0b3AgMnMgZWFzZSwgbGVmdCAycyBlYXNlLCB0cmFuc2Zvcm0gMnMgZWFzZVwiO1xyXG5cdFx0XHRpZiAocmFuZG9tWCA8IGNvbnRhaW5lcldpZHRoIC8gMikge1xyXG5cdFx0XHRcdC8vIFJvdGF0ZSB0aGUgc3RhciB0byB0aGUgcmlnaHQgYSBiaXRcclxuXHRcdFx0XHRjb25zdCByb3RhdGlvbiA9IDUgKyAoTWF0aC5yYW5kb20oKSAqIDgpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUm90YXRpbmcgc3RhciB0byB0aGUgcmlnaHRcIiwgcm90YXRpb24pO1xyXG5cdFx0XHRcdHN0YXJUb1Nob3cuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGUoLVwiICsgcm90YXRpb24gKyBcImRlZykgc2NhbGUoMSlcIjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBSb3RhdGUgdGhlIHN0YXIgdG8gdGhlIGxlZnQgYSBiaXRcclxuXHRcdFx0XHRjb25zdCByb3RhdGlvbiA9IDUgKyAoTWF0aC5yYW5kb20oKSAqIDgpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiUm90YXRpbmcgc3RhciB0byB0aGUgbGVmdFwiLCByb3RhdGlvbik7XHJcblx0XHRcdFx0c3RhclRvU2hvdy5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZShcIiArIHJvdGF0aW9uICsgXCJkZWcpIHNjYWxlKDEpXCI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXJUb1Nob3cuc3R5bGUubGVmdCA9IDIwICsgcmFuZG9tWCArIFwicHhcIjtcclxuXHRcdFx0c3RhclRvU2hvdy5zdHlsZS50b3AgPSAyMCArIHJhbmRvbVkgKyBcInB4XCI7XHJcblxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRzdGFyVG9TaG93LnN0eWxlLmZpbHRlciA9IFwiZHJvcC1zaGFkb3coMHB4IDBweCAxMHB4IHllbGxvdylcIjtcclxuXHRcdFx0fSwgMTkwMCk7XHJcblx0XHR9LCAxMDAwKTtcclxuXHJcblx0XHRVSUNvbnRyb2xsZXIuaW5zdGFuY2Uuc3RhclBvc2l0aW9ucy5wdXNoKHsgeDogcmFuZG9tWCwgeTogcmFuZG9tWSB9KTtcclxuXHJcblx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5xQW5zTnVtICs9IDE7XHJcblxyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuc2hvd25TdGFyc0NvdW50ICs9IDE7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIENoYW5nZVN0YXJJbWFnZUFmdGVyQW5pbWF0aW9uKCk6IHZvaWQge1xyXG5cdFx0dmFyIHN0YXJUb1Nob3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJcIiArIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnN0YXJzW1VJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnFBbnNOdW0gLSAxXSkgYXMgSFRNTEltYWdlRWxlbWVudDtcclxuXHRcdHN0YXJUb1Nob3cuc3JjID0gJy4uL2ltZy9zdGFyX2FmdGVyX2FuaW1hdGlvbi5naWYnXHJcblx0fVxyXG5cclxuXHJcblx0cHJpdmF0ZSBhbnN3ZXJCdXR0b25QcmVzcyhidXR0b25OdW06IG51bWJlcik6IHZvaWQge1xyXG5cdFx0Y29uc3QgYWxsQnV0dG9uc1Zpc2libGUgPSB0aGlzLmJ1dHRvbnMuZXZlcnkoYnV0dG9uID0+IGJ1dHRvbi5zdHlsZS52aXNpYmlsaXR5ID09PSBcInZpc2libGVcIik7XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLmJ1dHRvbnNBY3RpdmUsIGFsbEJ1dHRvbnNWaXNpYmxlKTtcclxuXHRcdGlmICh0aGlzLmJ1dHRvbnNBY3RpdmUgPT09IHRydWUpIHtcclxuXHRcdFx0QXVkaW9Db250cm9sbGVyLlBsYXlEaW5nKCk7XHJcblx0XHRcdGNvbnN0IG5QcmVzc2VkID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0Y29uc3QgZFRpbWUgPSBuUHJlc3NlZCAtIHRoaXMucVN0YXJ0O1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcImFuc3dlcmVkIGluIFwiICsgZFRpbWUpO1xyXG5cdFx0XHR0aGlzLmJ1dHRvblByZXNzQ2FsbGJhY2soYnV0dG9uTnVtLCBkVGltZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhdGljIFByb2dyZXNzQ2hlc3QoKSB7XHJcblx0XHRjb25zdCBjaGVzdEltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoZXN0SW1hZ2UnKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xyXG5cdFx0bGV0IGN1cnJlbnRJbWdTcmMgPSBjaGVzdEltYWdlLnNyY1xyXG5cdFx0Y29uc29sZS5sb2coJ0NoZXN0IFByb2dyZXNzaW9uLS0+JywgY2hlc3RJbWFnZSk7XHJcblx0XHRjb25zb2xlLmxvZygnQ2hlc3QgUHJvZ3Jlc3Npb24tLT4nLCBjaGVzdEltYWdlLnNyYyk7XHJcblx0XHRjb25zdCBjdXJyZW50SW1hZ2VOdW1iZXIgPSBwYXJzZUludChjdXJyZW50SW1nU3JjLnNsaWNlKC02LCAtNCksIDEwKTtcclxuXHRcdGNvbnNvbGUubG9nKCdDaGVzdCBQcm9ncmVzc2lvbiBudW1iZXItLT4nLCBjdXJyZW50SW1hZ2VOdW1iZXIpO1xyXG5cdFx0Y29uc3QgbmV4dEltYWdlTnVtYmVyID0gY3VycmVudEltYWdlTnVtYmVyICUgNCArIDE7XHJcblx0XHRjb25zdCBuZXh0SW1hZ2VTcmMgPSBgaW1nL2NoZXN0cHJvZ3Jlc3Npb24vVHJlYXN1cmVDaGVzdE9wZW4wJHtuZXh0SW1hZ2VOdW1iZXJ9LnN2Z2A7XHJcblx0XHRjaGVzdEltYWdlLnNyYyA9IG5leHRJbWFnZVNyYztcclxuXHJcblxyXG5cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgU2V0Q29udGVudExvYWRlZCh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xyXG5cdFx0VUlDb250cm9sbGVyLmdldEluc3RhbmNlKCkuY29udGVudExvYWRlZCA9IHZhbHVlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHN0YXRpYyBTZXRCdXR0b25QcmVzc0FjdGlvbihjYWxsYmFjazogRnVuY3Rpb24pOiB2b2lkIHtcclxuXHRcdFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLmJ1dHRvblByZXNzQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgU2V0U3RhcnRBY3Rpb24oY2FsbGJhY2s6IEZ1bmN0aW9uKTogdm9pZCB7XHJcblx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zdGFydFByZXNzQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogVUlDb250cm9sbGVyIHtcclxuXHRcdGlmIChVSUNvbnRyb2xsZXIuaW5zdGFuY2UgPT09IG51bGwpIHtcclxuXHRcdFx0VUlDb250cm9sbGVyLmluc3RhbmNlID0gbmV3IFVJQ29udHJvbGxlcigpO1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuaW5zdGFuY2UuaW5pdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBVSUNvbnRyb2xsZXIuaW5zdGFuY2U7XHJcblx0fVxyXG59XHJcbiIsIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IEZpcmViYXNlIGNvbnN0YW50cy4gIFNvbWUgb2YgdGhlc2UgKEBkZWZpbmVzKSBjYW4gYmUgb3ZlcnJpZGRlbiBhdCBjb21waWxlLXRpbWUuXHJcbiAqL1xyXG5jb25zdCBDT05TVEFOVFMgPSB7XHJcbiAgICAvKipcclxuICAgICAqIEBkZWZpbmUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBpcyB0aGUgY2xpZW50IE5vZGUuanMgU0RLLlxyXG4gICAgICovXHJcbiAgICBOT0RFX0NMSUVOVDogZmFsc2UsXHJcbiAgICAvKipcclxuICAgICAqIEBkZWZpbmUge2Jvb2xlYW59IFdoZXRoZXIgdGhpcyBpcyB0aGUgQWRtaW4gTm9kZS5qcyBTREsuXHJcbiAgICAgKi9cclxuICAgIE5PREVfQURNSU46IGZhbHNlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXJlYmFzZSBTREsgVmVyc2lvblxyXG4gICAgICovXHJcbiAgICBTREtfVkVSU0lPTjogJyR7SlNDT1JFX1ZFUlNJT059J1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVGhyb3dzIGFuIGVycm9yIGlmIHRoZSBwcm92aWRlZCBhc3NlcnRpb24gaXMgZmFsc3lcclxuICovXHJcbmNvbnN0IGFzc2VydCA9IGZ1bmN0aW9uIChhc3NlcnRpb24sIG1lc3NhZ2UpIHtcclxuICAgIGlmICghYXNzZXJ0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgYXNzZXJ0aW9uRXJyb3IobWVzc2FnZSk7XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIEVycm9yIG9iamVjdCBzdWl0YWJsZSBmb3IgdGhyb3dpbmcuXHJcbiAqL1xyXG5jb25zdCBhc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICByZXR1cm4gbmV3IEVycm9yKCdGaXJlYmFzZSBEYXRhYmFzZSAoJyArXHJcbiAgICAgICAgQ09OU1RBTlRTLlNES19WRVJTSU9OICtcclxuICAgICAgICAnKSBJTlRFUk5BTCBBU1NFUlQgRkFJTEVEOiAnICtcclxuICAgICAgICBtZXNzYWdlKTtcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3Qgc3RyaW5nVG9CeXRlQXJyYXkkMSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKChjICYgMHhmYzAwKSA9PT0gMHhkODAwICYmXHJcbiAgICAgICAgICAgIGkgKyAxIDwgc3RyLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICAoc3RyLmNoYXJDb2RlQXQoaSArIDEpICYgMHhmYzAwKSA9PT0gMHhkYzAwKSB7XHJcbiAgICAgICAgICAgIC8vIFN1cnJvZ2F0ZSBQYWlyXHJcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKChjICYgMHgwM2ZmKSA8PCAxMCkgKyAoc3RyLmNoYXJDb2RlQXQoKytpKSAmIDB4MDNmZik7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTgpIHwgMjQwO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiAxMikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyA+PiAxMikgfCAyMjQ7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKChjID4+IDYpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXQ7XHJcbn07XHJcbi8qKlxyXG4gKiBUdXJucyBhbiBhcnJheSBvZiBudW1iZXJzIGludG8gdGhlIHN0cmluZyBnaXZlbiBieSB0aGUgY29uY2F0ZW5hdGlvbiBvZiB0aGVcclxuICogY2hhcmFjdGVycyB0byB3aGljaCB0aGUgbnVtYmVycyBjb3JyZXNwb25kLlxyXG4gKiBAcGFyYW0gYnl0ZXMgQXJyYXkgb2YgbnVtYmVycyByZXByZXNlbnRpbmcgY2hhcmFjdGVycy5cclxuICogQHJldHVybiBTdHJpbmdpZmljYXRpb24gb2YgdGhlIGFycmF5LlxyXG4gKi9cclxuY29uc3QgYnl0ZUFycmF5VG9TdHJpbmcgPSBmdW5jdGlvbiAoYnl0ZXMpIHtcclxuICAgIC8vIFRPRE8odXNlcik6IFVzZSBuYXRpdmUgaW1wbGVtZW50YXRpb25zIGlmL3doZW4gYXZhaWxhYmxlXHJcbiAgICBjb25zdCBvdXQgPSBbXTtcclxuICAgIGxldCBwb3MgPSAwLCBjID0gMDtcclxuICAgIHdoaWxlIChwb3MgPCBieXRlcy5sZW5ndGgpIHtcclxuICAgICAgICBjb25zdCBjMSA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICBpZiAoYzEgPCAxMjgpIHtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYzEgPiAxOTEgJiYgYzEgPCAyMjQpIHtcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMxICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYzEgPiAyMzkgJiYgYzEgPCAzNjUpIHtcclxuICAgICAgICAgICAgLy8gU3Vycm9nYXRlIFBhaXJcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IGMzID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCBjNCA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgY29uc3QgdSA9ICgoKGMxICYgNykgPDwgMTgpIHwgKChjMiAmIDYzKSA8PCAxMikgfCAoKGMzICYgNjMpIDw8IDYpIHwgKGM0ICYgNjMpKSAtXHJcbiAgICAgICAgICAgICAgICAweDEwMDAwO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMHhkODAwICsgKHUgPj4gMTApKTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZGMwMCArICh1ICYgMTAyMykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgYzIgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IGMzID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xyXG59O1xyXG4vLyBXZSBkZWZpbmUgaXQgYXMgYW4gb2JqZWN0IGxpdGVyYWwgaW5zdGVhZCBvZiBhIGNsYXNzIGJlY2F1c2UgYSBjbGFzcyBjb21waWxlZCBkb3duIHRvIGVzNSBjYW4ndFxyXG4vLyBiZSB0cmVlc2hha2VkLiBodHRwczovL2dpdGh1Yi5jb20vcm9sbHVwL3JvbGx1cC9pc3N1ZXMvMTY5MVxyXG4vLyBTdGF0aWMgbG9va3VwIG1hcHMsIGxhemlseSBwb3B1bGF0ZWQgYnkgaW5pdF8oKVxyXG5jb25zdCBiYXNlNjQgPSB7XHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gY2hhcmFjdGVycy5cclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqL1xyXG4gICAgY2hhclRvQnl0ZU1hcF86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE1hcHMgYnl0ZXMgdG8gd2Vic2FmZSBjaGFyYWN0ZXJzLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgYnl0ZVRvQ2hhck1hcFdlYlNhZmVfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIHdlYnNhZmUgY2hhcmFjdGVycyB0byBieXRlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNoYXJUb0J5dGVNYXBXZWJTYWZlXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQsIHNoYXJlZCBiZXR3ZWVuXHJcbiAgICAgKiBFTkNPREVEX1ZBTFMgYW5kIEVOQ09ERURfVkFMU19XRUJTQUZFXHJcbiAgICAgKi9cclxuICAgIEVOQ09ERURfVkFMU19CQVNFOiAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonICsgJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6JyArICcwMTIzNDU2Nzg5JyxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIGRlZmF1bHQgYWxwaGFiZXQuIFZhbHVlIDY0ICg9KSBpcyBzcGVjaWFsOyBpdCBtZWFucyBcIm5vdGhpbmcuXCJcclxuICAgICAqL1xyXG4gICAgZ2V0IEVOQ09ERURfVkFMUygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICcrLz0nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogT3VyIHdlYnNhZmUgYWxwaGFiZXQuXHJcbiAgICAgKi9cclxuICAgIGdldCBFTkNPREVEX1ZBTFNfV0VCU0FGRSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5FTkNPREVEX1ZBTFNfQkFTRSArICctXy4nO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogV2hldGhlciB0aGlzIGJyb3dzZXIgc3VwcG9ydHMgdGhlIGF0b2IgYW5kIGJ0b2EgZnVuY3Rpb25zLiBUaGlzIGV4dGVuc2lvblxyXG4gICAgICogc3RhcnRlZCBhdCBNb3ppbGxhIGJ1dCBpcyBub3cgaW1wbGVtZW50ZWQgYnkgbWFueSBicm93c2Vycy4gV2UgdXNlIHRoZVxyXG4gICAgICogQVNTVU1FXyogdmFyaWFibGVzIHRvIGF2b2lkIHB1bGxpbmcgaW4gdGhlIGZ1bGwgdXNlcmFnZW50IGRldGVjdGlvbiBsaWJyYXJ5XHJcbiAgICAgKiBidXQgc3RpbGwgYWxsb3dpbmcgdGhlIHN0YW5kYXJkIHBlci1icm93c2VyIGNvbXBpbGF0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIEhBU19OQVRJVkVfU1VQUE9SVDogdHlwZW9mIGF0b2IgPT09ICdmdW5jdGlvbicsXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1lbmNvZGUgYW4gYXJyYXkgb2YgYnl0ZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IEFuIGFycmF5IG9mIGJ5dGVzIChudW1iZXJzIHdpdGhcclxuICAgICAqICAgICB2YWx1ZSBpbiBbMCwgMjU1XSkgdG8gZW5jb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgQm9vbGVhbiBpbmRpY2F0aW5nIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGVuY29kZUJ5dGVBcnJheShpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoJ2VuY29kZUJ5dGVBcnJheSB0YWtlcyBhbiBhcnJheSBhcyBhIHBhcmFtZXRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmluaXRfKCk7XHJcbiAgICAgICAgY29uc3QgYnl0ZVRvQ2hhck1hcCA9IHdlYlNhZmVcclxuICAgICAgICAgICAgPyB0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1xyXG4gICAgICAgICAgICA6IHRoaXMuYnl0ZVRvQ2hhck1hcF87XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dC5sZW5ndGg7IGkgKz0gMykge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMSA9IGlucHV0W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpICsgMSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTIgPSBoYXZlQnl0ZTIgPyBpbnB1dFtpICsgMV0gOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTMgPSBpICsgMiA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBpbnB1dFtpICsgMl0gOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRCeXRlMSA9IGJ5dGUxID4+IDI7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMSAmIDB4MDMpIDw8IDQpIHwgKGJ5dGUyID4+IDQpO1xyXG4gICAgICAgICAgICBsZXQgb3V0Qnl0ZTMgPSAoKGJ5dGUyICYgMHgwZikgPDwgMikgfCAoYnl0ZTMgPj4gNik7XHJcbiAgICAgICAgICAgIGxldCBvdXRCeXRlNCA9IGJ5dGUzICYgMHgzZjtcclxuICAgICAgICAgICAgaWYgKCFoYXZlQnl0ZTMpIHtcclxuICAgICAgICAgICAgICAgIG91dEJ5dGU0ID0gNjQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhdmVCeXRlMikge1xyXG4gICAgICAgICAgICAgICAgICAgIG91dEJ5dGUzID0gNjQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3V0cHV0LnB1c2goYnl0ZVRvQ2hhck1hcFtvdXRCeXRlMV0sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTJdLCBieXRlVG9DaGFyTWFwW291dEJ5dGUzXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlNF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogQmFzZTY0LWVuY29kZSBhIHN0cmluZy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgQSBzdHJpbmcgdG8gZW5jb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgSWYgdHJ1ZSwgd2Ugc2hvdWxkIHVzZSB0aGVcclxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gVGhlIGJhc2U2NCBlbmNvZGVkIHN0cmluZy5cclxuICAgICAqL1xyXG4gICAgZW5jb2RlU3RyaW5nKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcclxuICAgICAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXHJcbiAgICAgICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBidG9hKGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5jb2RlQnl0ZUFycmF5KHN0cmluZ1RvQnl0ZUFycmF5JDEoaW5wdXQpLCB3ZWJTYWZlKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IHRvIGRlY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIFRydWUgaWYgd2Ugc2hvdWxkIHVzZSB0aGVcclxuICAgICAqICAgICBhbHRlcm5hdGl2ZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZGVjb2RlZCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgZGVjb2RlU3RyaW5nKGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgLy8gU2hvcnRjdXQgZm9yIE1vemlsbGEgYnJvd3NlcnMgdGhhdCBpbXBsZW1lbnRcclxuICAgICAgICAvLyBhIG5hdGl2ZSBiYXNlNjQgZW5jb2RlciBpbiB0aGUgZm9ybSBvZiBcImJ0b2EvYXRvYlwiXHJcbiAgICAgICAgaWYgKHRoaXMuSEFTX05BVElWRV9TVVBQT1JUICYmICF3ZWJTYWZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhdG9iKGlucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ5dGVBcnJheVRvU3RyaW5nKHRoaXMuZGVjb2RlU3RyaW5nVG9CeXRlQXJyYXkoaW5wdXQsIHdlYlNhZmUpKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1kZWNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogSW4gYmFzZS02NCBkZWNvZGluZywgZ3JvdXBzIG9mIGZvdXIgY2hhcmFjdGVycyBhcmUgY29udmVydGVkIGludG8gdGhyZWVcclxuICAgICAqIGJ5dGVzLiAgSWYgdGhlIGVuY29kZXIgZGlkIG5vdCBhcHBseSBwYWRkaW5nLCB0aGUgaW5wdXQgbGVuZ3RoIG1heSBub3RcclxuICAgICAqIGJlIGEgbXVsdGlwbGUgb2YgNC5cclxuICAgICAqXHJcbiAgICAgKiBJbiB0aGlzIGNhc2UsIHRoZSBsYXN0IGdyb3VwIHdpbGwgaGF2ZSBmZXdlciB0aGFuIDQgY2hhcmFjdGVycywgYW5kXHJcbiAgICAgKiBwYWRkaW5nIHdpbGwgYmUgaW5mZXJyZWQuICBJZiB0aGUgZ3JvdXAgaGFzIG9uZSBvciB0d28gY2hhcmFjdGVycywgaXQgZGVjb2Rlc1xyXG4gICAgICogdG8gb25lIGJ5dGUuICBJZiB0aGUgZ3JvdXAgaGFzIHRocmVlIGNoYXJhY3RlcnMsIGl0IGRlY29kZXMgdG8gdHdvIGJ5dGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCBJbnB1dCB0byBkZWNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBUcnVlIGlmIHdlIHNob3VsZCB1c2UgdGhlIHdlYi1zYWZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBieXRlcyByZXByZXNlbnRpbmcgdGhlIGRlY29kZWQgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSB7XHJcbiAgICAgICAgdGhpcy5pbml0XygpO1xyXG4gICAgICAgIGNvbnN0IGNoYXJUb0J5dGVNYXAgPSB3ZWJTYWZlXHJcbiAgICAgICAgICAgID8gdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV9cclxuICAgICAgICAgICAgOiB0aGlzLmNoYXJUb0J5dGVNYXBfO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOykge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMSA9IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkrKyldO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTIgPSBpIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlMiA9IGhhdmVCeXRlMiA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDA7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUzID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTMgPSBoYXZlQnl0ZTMgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXZlQnl0ZTQgPSBpIDwgaW5wdXQubGVuZ3RoO1xyXG4gICAgICAgICAgICBjb25zdCBieXRlNCA9IGhhdmVCeXRlNCA/IGNoYXJUb0J5dGVNYXBbaW5wdXQuY2hhckF0KGkpXSA6IDY0O1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGlmIChieXRlMSA9PSBudWxsIHx8IGJ5dGUyID09IG51bGwgfHwgYnl0ZTMgPT0gbnVsbCB8fCBieXRlNCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUxID0gKGJ5dGUxIDw8IDIpIHwgKGJ5dGUyID4+IDQpO1xyXG4gICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMSk7XHJcbiAgICAgICAgICAgIGlmIChieXRlMyAhPT0gNjQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUyID0gKChieXRlMiA8PCA0KSAmIDB4ZjApIHwgKGJ5dGUzID4+IDIpO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ5dGU0ICE9PSA2NCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG91dEJ5dGUzID0gKChieXRlMyA8PCA2KSAmIDB4YzApIHwgYnl0ZTQ7XHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2gob3V0Qnl0ZTMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBMYXp5IHN0YXRpYyBpbml0aWFsaXphdGlvbiBmdW5jdGlvbi4gQ2FsbGVkIGJlZm9yZVxyXG4gICAgICogYWNjZXNzaW5nIGFueSBvZiB0aGUgc3RhdGljIG1hcCB2YXJpYWJsZXMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBpbml0XygpIHtcclxuICAgICAgICBpZiAoIXRoaXMuYnl0ZVRvQ2hhck1hcF8pIHtcclxuICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwXyA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfID0ge307XHJcbiAgICAgICAgICAgIC8vIFdlIHdhbnQgcXVpY2sgbWFwcGluZ3MgYmFjayBhbmQgZm9ydGgsIHNvIHdlIHByZWNvbXB1dGUgdHdvIG1hcHMuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5FTkNPREVEX1ZBTFMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcF9baV0gPSB0aGlzLkVOQ09ERURfVkFMUy5jaGFyQXQoaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBfW3RoaXMuYnl0ZVRvQ2hhck1hcF9baV1dID0gaTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldID0gdGhpcy5FTkNPREVEX1ZBTFNfV0VCU0FGRS5jaGFyQXQoaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlX1t0aGlzLmJ5dGVUb0NoYXJNYXBXZWJTYWZlX1tpXV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgLy8gQmUgZm9yZ2l2aW5nIHdoZW4gZGVjb2RpbmcgYW5kIGNvcnJlY3RseSBkZWNvZGUgYm90aCBlbmNvZGluZ3MuXHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+PSB0aGlzLkVOQ09ERURfVkFMU19CQVNFLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF9bdGhpcy5FTkNPREVEX1ZBTFNfV0VCU0FGRS5jaGFyQXQoaSldID0gaTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYXJUb0J5dGVNYXBXZWJTYWZlX1t0aGlzLkVOQ09ERURfVkFMUy5jaGFyQXQoaSldID0gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZ1xyXG4gKi9cclxuY29uc3QgYmFzZTY0RW5jb2RlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgY29uc3QgdXRmOEJ5dGVzID0gc3RyaW5nVG9CeXRlQXJyYXkkMShzdHIpO1xyXG4gICAgcmV0dXJuIGJhc2U2NC5lbmNvZGVCeXRlQXJyYXkodXRmOEJ5dGVzLCB0cnVlKTtcclxufTtcclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBlbmNvZGluZyAod2l0aG91dCBcIi5cIiBwYWRkaW5nIGluIHRoZSBlbmQpLlxyXG4gKiBlLmcuIFVzZWQgaW4gSlNPTiBXZWIgVG9rZW4gKEpXVCkgcGFydHMuXHJcbiAqL1xyXG5jb25zdCBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIC8vIFVzZSBiYXNlNjR1cmwgZW5jb2RpbmcgYW5kIHJlbW92ZSBwYWRkaW5nIGluIHRoZSBlbmQgKGRvdCBjaGFyYWN0ZXJzKS5cclxuICAgIHJldHVybiBiYXNlNjRFbmNvZGUoc3RyKS5yZXBsYWNlKC9cXC4vZywgJycpO1xyXG59O1xyXG4vKipcclxuICogVVJMLXNhZmUgYmFzZTY0IGRlY29kaW5nXHJcbiAqXHJcbiAqIE5PVEU6IERPIE5PVCB1c2UgdGhlIGdsb2JhbCBhdG9iKCkgZnVuY3Rpb24gLSBpdCBkb2VzIE5PVCBzdXBwb3J0IHRoZVxyXG4gKiBiYXNlNjRVcmwgdmFyaWFudCBlbmNvZGluZy5cclxuICpcclxuICogQHBhcmFtIHN0ciBUbyBiZSBkZWNvZGVkXHJcbiAqIEByZXR1cm4gRGVjb2RlZCByZXN1bHQsIGlmIHBvc3NpYmxlXHJcbiAqL1xyXG5jb25zdCBiYXNlNjREZWNvZGUgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBiYXNlNjQuZGVjb2RlU3RyaW5nKHN0ciwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2Jhc2U2NERlY29kZSBmYWlsZWQ6ICcsIGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBEbyBhIGRlZXAtY29weSBvZiBiYXNpYyBKYXZhU2NyaXB0IE9iamVjdHMgb3IgQXJyYXlzLlxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcENvcHkodmFsdWUpIHtcclxuICAgIHJldHVybiBkZWVwRXh0ZW5kKHVuZGVmaW5lZCwgdmFsdWUpO1xyXG59XHJcbi8qKlxyXG4gKiBDb3B5IHByb3BlcnRpZXMgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0IChyZWN1cnNpdmVseSBhbGxvd3MgZXh0ZW5zaW9uXHJcbiAqIG9mIE9iamVjdHMgYW5kIEFycmF5cykuICBTY2FsYXIgdmFsdWVzIGluIHRoZSB0YXJnZXQgYXJlIG92ZXItd3JpdHRlbi5cclxuICogSWYgdGFyZ2V0IGlzIHVuZGVmaW5lZCwgYW4gb2JqZWN0IG9mIHRoZSBhcHByb3ByaWF0ZSB0eXBlIHdpbGwgYmUgY3JlYXRlZFxyXG4gKiAoYW5kIHJldHVybmVkKS5cclxuICpcclxuICogV2UgcmVjdXJzaXZlbHkgY29weSBhbGwgY2hpbGQgcHJvcGVydGllcyBvZiBwbGFpbiBPYmplY3RzIGluIHRoZSBzb3VyY2UtIHNvXHJcbiAqIHRoYXQgbmFtZXNwYWNlLSBsaWtlIGRpY3Rpb25hcmllcyBhcmUgbWVyZ2VkLlxyXG4gKlxyXG4gKiBOb3RlIHRoYXQgdGhlIHRhcmdldCBjYW4gYmUgYSBmdW5jdGlvbiwgaW4gd2hpY2ggY2FzZSB0aGUgcHJvcGVydGllcyBpblxyXG4gKiB0aGUgc291cmNlIE9iamVjdCBhcmUgY29waWVkIG9udG8gaXQgYXMgc3RhdGljIHByb3BlcnRpZXMgb2YgdGhlIEZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBOb3RlOiB3ZSBkb24ndCBtZXJnZSBfX3Byb3RvX18gdG8gcHJldmVudCBwcm90b3R5cGUgcG9sbHV0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwRXh0ZW5kKHRhcmdldCwgc291cmNlKSB7XHJcbiAgICBpZiAoIShzb3VyY2UgaW5zdGFuY2VvZiBPYmplY3QpKSB7XHJcbiAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgIH1cclxuICAgIHN3aXRjaCAoc291cmNlLmNvbnN0cnVjdG9yKSB7XHJcbiAgICAgICAgY2FzZSBEYXRlOlxyXG4gICAgICAgICAgICAvLyBUcmVhdCBEYXRlcyBsaWtlIHNjYWxhcnM7IGlmIHRoZSB0YXJnZXQgZGF0ZSBvYmplY3QgaGFkIGFueSBjaGlsZFxyXG4gICAgICAgICAgICAvLyBwcm9wZXJ0aWVzIC0gdGhleSB3aWxsIGJlIGxvc3QhXHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVWYWx1ZSA9IHNvdXJjZTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVWYWx1ZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgIGNhc2UgT2JqZWN0OlxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgQXJyYXk6XHJcbiAgICAgICAgICAgIC8vIEFsd2F5cyBjb3B5IHRoZSBhcnJheSBzb3VyY2UgYW5kIG92ZXJ3cml0ZSB0aGUgdGFyZ2V0LlxyXG4gICAgICAgICAgICB0YXJnZXQgPSBbXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gTm90IGEgcGxhaW4gT2JqZWN0IC0gdHJlYXQgaXQgYXMgYSBzY2FsYXIuXHJcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gc291cmNlKSB7XHJcbiAgICAgICAgLy8gdXNlIGlzVmFsaWRLZXkgdG8gZ3VhcmQgYWdhaW5zdCBwcm90b3R5cGUgcG9sbHV0aW9uLiBTZWUgaHR0cHM6Ly9zbnlrLmlvL3Z1bG4vU05ZSy1KUy1MT0RBU0gtNDUwMjAyXHJcbiAgICAgICAgaWYgKCFzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcCkgfHwgIWlzVmFsaWRLZXkocHJvcCkpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldFtwcm9wXSA9IGRlZXBFeHRlbmQodGFyZ2V0W3Byb3BdLCBzb3VyY2VbcHJvcF0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhcmdldDtcclxufVxyXG5mdW5jdGlvbiBpc1ZhbGlkS2V5KGtleSkge1xyXG4gICAgcmV0dXJuIGtleSAhPT0gJ19fcHJvdG9fXyc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgbmF2aWdhdG9yLnVzZXJBZ2VudCBzdHJpbmcgb3IgJycgaWYgaXQncyBub3QgZGVmaW5lZC5cclxuICogQHJldHVybiB1c2VyIGFnZW50IHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VUEoKSB7XHJcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICB0eXBlb2YgbmF2aWdhdG9yWyd1c2VyQWdlbnQnXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4gbmF2aWdhdG9yWyd1c2VyQWdlbnQnXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRGV0ZWN0IENvcmRvdmEgLyBQaG9uZUdhcCAvIElvbmljIGZyYW1ld29ya3Mgb24gYSBtb2JpbGUgZGV2aWNlLlxyXG4gKlxyXG4gKiBEZWxpYmVyYXRlbHkgZG9lcyBub3QgcmVseSBvbiBjaGVja2luZyBgZmlsZTovL2AgVVJMcyAoYXMgdGhpcyBmYWlscyBQaG9uZUdhcFxyXG4gKiBpbiB0aGUgUmlwcGxlIGVtdWxhdG9yKSBub3IgQ29yZG92YSBgb25EZXZpY2VSZWFkeWAsIHdoaWNoIHdvdWxkIG5vcm1hbGx5XHJcbiAqIHdhaXQgZm9yIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5mdW5jdGlvbiBpc01vYmlsZUNvcmRvdmEoKSB7XHJcbiAgICByZXR1cm4gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBTZXR0aW5nIHVwIGFuIGJyb2FkbHkgYXBwbGljYWJsZSBpbmRleCBzaWduYXR1cmUgZm9yIFdpbmRvd1xyXG4gICAgICAgIC8vIGp1c3QgdG8gZGVhbCB3aXRoIHRoaXMgY2FzZSB3b3VsZCBwcm9iYWJseSBiZSBhIGJhZCBpZGVhLlxyXG4gICAgICAgICEhKHdpbmRvd1snY29yZG92YSddIHx8IHdpbmRvd1sncGhvbmVnYXAnXSB8fCB3aW5kb3dbJ1Bob25lR2FwJ10pICYmXHJcbiAgICAgICAgL2lvc3xpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWR8YmxhY2tiZXJyeXxpZW1vYmlsZS9pLnRlc3QoZ2V0VUEoKSkpO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgTm9kZS5qcy5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIE5vZGUuanMgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQuXHJcbiAqL1xyXG4vLyBOb2RlIGRldGVjdGlvbiBsb2dpYyBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vaWxpYWthbi9kZXRlY3Qtbm9kZS9cclxuZnVuY3Rpb24gaXNOb2RlKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09ICdbb2JqZWN0IHByb2Nlc3NdJyk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRGV0ZWN0IEJyb3dzZXIgRW52aXJvbm1lbnRcclxuICovXHJcbmZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcclxuICAgIHJldHVybiB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmO1xyXG59XHJcbmZ1bmN0aW9uIGlzQnJvd3NlckV4dGVuc2lvbigpIHtcclxuICAgIGNvbnN0IHJ1bnRpbWUgPSB0eXBlb2YgY2hyb21lID09PSAnb2JqZWN0J1xyXG4gICAgICAgID8gY2hyb21lLnJ1bnRpbWVcclxuICAgICAgICA6IHR5cGVvZiBicm93c2VyID09PSAnb2JqZWN0J1xyXG4gICAgICAgICAgICA/IGJyb3dzZXIucnVudGltZVxyXG4gICAgICAgICAgICA6IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiB0eXBlb2YgcnVudGltZSA9PT0gJ29iamVjdCcgJiYgcnVudGltZS5pZCAhPT0gdW5kZWZpbmVkO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgUmVhY3QgTmF0aXZlLlxyXG4gKlxyXG4gKiBAcmV0dXJuIHRydWUgaWYgUmVhY3ROYXRpdmUgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQuXHJcbiAqL1xyXG5mdW5jdGlvbiBpc1JlYWN0TmF0aXZlKCkge1xyXG4gICAgcmV0dXJuICh0eXBlb2YgbmF2aWdhdG9yID09PSAnb2JqZWN0JyAmJiBuYXZpZ2F0b3JbJ3Byb2R1Y3QnXSA9PT0gJ1JlYWN0TmF0aXZlJyk7XHJcbn1cclxuLyoqIERldGVjdHMgRWxlY3Ryb24gYXBwcy4gKi9cclxuZnVuY3Rpb24gaXNFbGVjdHJvbigpIHtcclxuICAgIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ0VsZWN0cm9uLycpID49IDA7XHJcbn1cclxuLyoqIERldGVjdHMgSW50ZXJuZXQgRXhwbG9yZXIuICovXHJcbmZ1bmN0aW9uIGlzSUUoKSB7XHJcbiAgICBjb25zdCB1YSA9IGdldFVBKCk7XHJcbiAgICByZXR1cm4gdWEuaW5kZXhPZignTVNJRSAnKSA+PSAwIHx8IHVhLmluZGV4T2YoJ1RyaWRlbnQvJykgPj0gMDtcclxufVxyXG4vKiogRGV0ZWN0cyBVbml2ZXJzYWwgV2luZG93cyBQbGF0Zm9ybSBhcHBzLiAqL1xyXG5mdW5jdGlvbiBpc1VXUCgpIHtcclxuICAgIHJldHVybiBnZXRVQSgpLmluZGV4T2YoJ01TQXBwSG9zdC8nKSA+PSAwO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3Qgd2hldGhlciB0aGUgY3VycmVudCBTREsgYnVpbGQgaXMgdGhlIE5vZGUgdmVyc2lvbi5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIGl0J3MgdGhlIE5vZGUgU0RLIGJ1aWxkLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNOb2RlU2RrKCkge1xyXG4gICAgcmV0dXJuIENPTlNUQU5UUy5OT0RFX0NMSUVOVCA9PT0gdHJ1ZSB8fCBDT05TVEFOVFMuTk9ERV9BRE1JTiA9PT0gdHJ1ZTtcclxufVxyXG4vKiogUmV0dXJucyB0cnVlIGlmIHdlIGFyZSBydW5uaW5nIGluIFNhZmFyaS4gKi9cclxuZnVuY3Rpb24gaXNTYWZhcmkoKSB7XHJcbiAgICByZXR1cm4gKCFpc05vZGUoKSAmJlxyXG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ1NhZmFyaScpICYmXHJcbiAgICAgICAgIW5hdmlnYXRvci51c2VyQWdlbnQuaW5jbHVkZXMoJ0Nocm9tZScpKTtcclxufVxyXG4vKipcclxuICogVGhpcyBtZXRob2QgY2hlY2tzIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcclxuICogQHJldHVybiB0cnVlIGlmIGluZGV4ZWREQiBpcyBzdXBwb3J0ZWQgYnkgY3VycmVudCBicm93c2VyL3NlcnZpY2Ugd29ya2VyIGNvbnRleHRcclxuICovXHJcbmZ1bmN0aW9uIGlzSW5kZXhlZERCQXZhaWxhYmxlKCkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiBpbmRleGVkREIgPT09ICdvYmplY3QnO1xyXG59XHJcbi8qKlxyXG4gKiBUaGlzIG1ldGhvZCB2YWxpZGF0ZXMgYnJvd3Nlci9zdyBjb250ZXh0IGZvciBpbmRleGVkREIgYnkgb3BlbmluZyBhIGR1bW15IGluZGV4ZWREQiBkYXRhYmFzZSBhbmQgcmVqZWN0XHJcbiAqIGlmIGVycm9ycyBvY2N1ciBkdXJpbmcgdGhlIGRhdGFiYXNlIG9wZW4gb3BlcmF0aW9uLlxyXG4gKlxyXG4gKiBAdGhyb3dzIGV4Y2VwdGlvbiBpZiBjdXJyZW50IGJyb3dzZXIvc3cgY29udGV4dCBjYW4ndCBydW4gaWRiLm9wZW4gKGV4OiBTYWZhcmkgaWZyYW1lLCBGaXJlZm94XHJcbiAqIHByaXZhdGUgYnJvd3NpbmcpXHJcbiAqL1xyXG5mdW5jdGlvbiB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgcHJlRXhpc3QgPSB0cnVlO1xyXG4gICAgICAgICAgICBjb25zdCBEQl9DSEVDS19OQU1FID0gJ3ZhbGlkYXRlLWJyb3dzZXItY29udGV4dC1mb3ItaW5kZXhlZGRiLWFuYWx5dGljcy1tb2R1bGUnO1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gc2VsZi5pbmRleGVkREIub3BlbihEQl9DSEVDS19OQU1FKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0LnJlc3VsdC5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gZGVsZXRlIGRhdGFiYXNlIG9ubHkgd2hlbiBpdCBkb2Vzbid0IHByZS1leGlzdFxyXG4gICAgICAgICAgICAgICAgaWYgKCFwcmVFeGlzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5kZXhlZERCLmRlbGV0ZURhdGFiYXNlKERCX0NIRUNLX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwcmVFeGlzdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoKChfYSA9IHJlcXVlc3QuZXJyb3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlKSB8fCAnJyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBUaGlzIG1ldGhvZCBjaGVja3Mgd2hldGhlciBjb29raWUgaXMgZW5hYmxlZCB3aXRoaW4gY3VycmVudCBicm93c2VyXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBjb29raWUgaXMgZW5hYmxlZCB3aXRoaW4gY3VycmVudCBicm93c2VyXHJcbiAqL1xyXG5mdW5jdGlvbiBhcmVDb29raWVzRW5hYmxlZCgpIHtcclxuICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJyB8fCAhbmF2aWdhdG9yLmNvb2tpZUVuYWJsZWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG4vKipcclxuICogUG9seWZpbGwgZm9yIGBnbG9iYWxUaGlzYCBvYmplY3QuXHJcbiAqIEByZXR1cm5zIHRoZSBgZ2xvYmFsVGhpc2Agb2JqZWN0IGZvciB0aGUgZ2l2ZW4gZW52aXJvbm1lbnQuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRHbG9iYWwoKSB7XHJcbiAgICBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGY7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIGdsb2JhbDtcclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0LicpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUdsb2JhbCA9ICgpID0+IGdldEdsb2JhbCgpLl9fRklSRUJBU0VfREVGQVVMVFNfXztcclxuLyoqXHJcbiAqIEF0dGVtcHQgdG8gcmVhZCBkZWZhdWx0cyBmcm9tIGEgSlNPTiBzdHJpbmcgcHJvdmlkZWQgdG9cclxuICogcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19fIG9yIGEgSlNPTiBmaWxlIHdob3NlIHBhdGggaXMgaW5cclxuICogcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19QQVRIX19cclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlID0gKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcHJvY2Vzcy5lbnYgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVmYXVsdHNKc29uU3RyaW5nID0gcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xyXG4gICAgaWYgKGRlZmF1bHRzSnNvblN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlZmF1bHRzSnNvblN0cmluZyk7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUNvb2tpZSA9ICgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IG1hdGNoO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvX19GSVJFQkFTRV9ERUZBVUxUU19fPShbXjtdKykvKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gU29tZSBlbnZpcm9ubWVudHMgc3VjaCBhcyBBbmd1bGFyIFVuaXZlcnNhbCBTU1IgaGF2ZSBhXHJcbiAgICAgICAgLy8gYGRvY3VtZW50YCBvYmplY3QgYnV0IGVycm9yIG9uIGFjY2Vzc2luZyBgZG9jdW1lbnQuY29va2llYC5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWNvZGVkID0gbWF0Y2ggJiYgYmFzZTY0RGVjb2RlKG1hdGNoWzFdKTtcclxuICAgIHJldHVybiBkZWNvZGVkICYmIEpTT04ucGFyc2UoZGVjb2RlZCk7XHJcbn07XHJcbi8qKlxyXG4gKiBHZXQgdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuIEl0IGNoZWNrcyBpbiBvcmRlcjpcclxuICogKDEpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBhcyBhIHByb3BlcnR5IG9mIGBnbG9iYWxUaGlzYFxyXG4gKiAoMikgaWYgc3VjaCBhbiBvYmplY3Qgd2FzIHByb3ZpZGVkIG9uIGEgc2hlbGwgZW52aXJvbm1lbnQgdmFyaWFibGVcclxuICogKDMpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBpbiBhIGNvb2tpZVxyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdHMgPSAoKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiAoZ2V0RGVmYXVsdHNGcm9tR2xvYmFsKCkgfHxcclxuICAgICAgICAgICAgZ2V0RGVmYXVsdHNGcm9tRW52VmFyaWFibGUoKSB8fFxyXG4gICAgICAgICAgICBnZXREZWZhdWx0c0Zyb21Db29raWUoKSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENhdGNoLWFsbCBmb3IgYmVpbmcgdW5hYmxlIHRvIGdldCBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gZHVlXHJcbiAgICAgICAgICogdG8gYW55IGVudmlyb25tZW50IGNhc2Ugd2UgaGF2ZSBub3QgYWNjb3VudGVkIGZvci4gTG9nIHRvXHJcbiAgICAgICAgICogaW5mbyBpbnN0ZWFkIG9mIHN3YWxsb3dpbmcgc28gd2UgY2FuIGZpbmQgdGhlc2UgdW5rbm93biBjYXNlc1xyXG4gICAgICAgICAqIGFuZCBhZGQgcGF0aHMgZm9yIHRoZW0gaWYgbmVlZGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbyhgVW5hYmxlIHRvIGdldCBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gZHVlIHRvOiAke2V9YCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogUmV0dXJucyBlbXVsYXRvciBob3N0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxyXG4gKiBmb3IgdGhlIGdpdmVuIHByb2R1Y3QuXHJcbiAqIEByZXR1cm5zIGEgVVJMIGhvc3QgZm9ybWF0dGVkIGxpa2UgYDEyNy4wLjAuMTo5OTk5YCBvciBgWzo6MV06NDAwMGAgaWYgYXZhaWxhYmxlXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRFbXVsYXRvckhvc3QgPSAocHJvZHVjdE5hbWUpID0+IHsgdmFyIF9hLCBfYjsgcmV0dXJuIChfYiA9IChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5lbXVsYXRvckhvc3RzKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2JbcHJvZHVjdE5hbWVdOyB9O1xyXG4vKipcclxuICogUmV0dXJucyBlbXVsYXRvciBob3N0bmFtZSBhbmQgcG9ydCBzdG9yZWQgaW4gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3RcclxuICogZm9yIHRoZSBnaXZlbiBwcm9kdWN0LlxyXG4gKiBAcmV0dXJucyBhIHBhaXIgb2YgaG9zdG5hbWUgYW5kIHBvcnQgbGlrZSBgW1wiOjoxXCIsIDQwMDBdYCBpZiBhdmFpbGFibGVcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdG5hbWVBbmRQb3J0ID0gKHByb2R1Y3ROYW1lKSA9PiB7XHJcbiAgICBjb25zdCBob3N0ID0gZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdChwcm9kdWN0TmFtZSk7XHJcbiAgICBpZiAoIWhvc3QpIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgY29uc3Qgc2VwYXJhdG9ySW5kZXggPSBob3N0Lmxhc3RJbmRleE9mKCc6Jyk7IC8vIEZpbmRpbmcgdGhlIGxhc3Qgc2luY2UgSVB2NiBhZGRyIGFsc28gaGFzIGNvbG9ucy5cclxuICAgIGlmIChzZXBhcmF0b3JJbmRleCA8PSAwIHx8IHNlcGFyYXRvckluZGV4ICsgMSA9PT0gaG9zdC5sZW5ndGgpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgaG9zdCAke2hvc3R9IHdpdGggbm8gc2VwYXJhdGUgaG9zdG5hbWUgYW5kIHBvcnQhYCk7XHJcbiAgICB9XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1nbG9iYWxzXHJcbiAgICBjb25zdCBwb3J0ID0gcGFyc2VJbnQoaG9zdC5zdWJzdHJpbmcoc2VwYXJhdG9ySW5kZXggKyAxKSwgMTApO1xyXG4gICAgaWYgKGhvc3RbMF0gPT09ICdbJykge1xyXG4gICAgICAgIC8vIEJyYWNrZXQtcXVvdGVkIGBbaXB2NmFkZHJdOnBvcnRgID0+IHJldHVybiBcImlwdjZhZGRyXCIgKHdpdGhvdXQgYnJhY2tldHMpLlxyXG4gICAgICAgIHJldHVybiBbaG9zdC5zdWJzdHJpbmcoMSwgc2VwYXJhdG9ySW5kZXggLSAxKSwgcG9ydF07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gW2hvc3Quc3Vic3RyaW5nKDAsIHNlcGFyYXRvckluZGV4KSwgcG9ydF07XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIEZpcmViYXNlIGFwcCBjb25maWcgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0LlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0QXBwQ29uZmlnID0gKCkgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBnZXREZWZhdWx0cygpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29uZmlnOyB9O1xyXG4vKipcclxuICogUmV0dXJucyBhbiBleHBlcmltZW50YWwgc2V0dGluZyBvbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdCAocHJvcGVydGllc1xyXG4gKiBwcmVmaXhlZCBieSBcIl9cIilcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RXhwZXJpbWVudGFsU2V0dGluZyA9IChuYW1lKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtgXyR7bmFtZX1gXTsgfTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgRGVmZXJyZWQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yZWplY3QgPSAoKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5yZXNvbHZlID0gKCkgPT4geyB9O1xyXG4gICAgICAgIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgdGhpcy5yZWplY3QgPSByZWplY3Q7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE91ciBBUEkgaW50ZXJuYWxzIGFyZSBub3QgcHJvbWlzZWlmaWVkIGFuZCBjYW5ub3QgYmVjYXVzZSBvdXIgY2FsbGJhY2sgQVBJcyBoYXZlIHN1YnRsZSBleHBlY3RhdGlvbnMgYXJvdW5kXHJcbiAgICAgKiBpbnZva2luZyBwcm9taXNlcyBpbmxpbmUsIHdoaWNoIFByb21pc2VzIGFyZSBmb3JiaWRkZW4gdG8gZG8uIFRoaXMgbWV0aG9kIGFjY2VwdHMgYW4gb3B0aW9uYWwgbm9kZS1zdHlsZSBjYWxsYmFja1xyXG4gICAgICogYW5kIHJldHVybnMgYSBub2RlLXN0eWxlIGNhbGxiYWNrIHdoaWNoIHdpbGwgcmVzb2x2ZSBvciByZWplY3QgdGhlIERlZmVycmVkJ3MgcHJvbWlzZS5cclxuICAgICAqL1xyXG4gICAgd3JhcENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgcmV0dXJuIChlcnJvciwgdmFsdWUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIC8vIEF0dGFjaGluZyBub29wIGhhbmRsZXIganVzdCBpbiBjYXNlIGRldmVsb3BlciB3YXNuJ3QgZXhwZWN0aW5nXHJcbiAgICAgICAgICAgICAgICAvLyBwcm9taXNlc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9taXNlLmNhdGNoKCgpID0+IHsgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyBTb21lIG9mIG91ciBjYWxsYmFja3MgZG9uJ3QgZXhwZWN0IGEgdmFsdWUgYW5kIG91ciBvd24gdGVzdHNcclxuICAgICAgICAgICAgICAgIC8vIGFzc2VydCB0aGF0IHRoZSBwYXJhbWV0ZXIgbGVuZ3RoIGlzIDFcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjay5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgdmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVNb2NrVXNlclRva2VuKHRva2VuLCBwcm9qZWN0SWQpIHtcclxuICAgIGlmICh0b2tlbi51aWQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBcInVpZFwiIGZpZWxkIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQgYnkgbW9ja1VzZXJUb2tlbi4gUGxlYXNlIHVzZSBcInN1YlwiIGluc3RlYWQgZm9yIEZpcmViYXNlIEF1dGggVXNlciBJRC4nKTtcclxuICAgIH1cclxuICAgIC8vIFVuc2VjdXJlZCBKV1RzIHVzZSBcIm5vbmVcIiBhcyB0aGUgYWxnb3JpdGhtLlxyXG4gICAgY29uc3QgaGVhZGVyID0ge1xyXG4gICAgICAgIGFsZzogJ25vbmUnLFxyXG4gICAgICAgIHR5cGU6ICdKV1QnXHJcbiAgICB9O1xyXG4gICAgY29uc3QgcHJvamVjdCA9IHByb2plY3RJZCB8fCAnZGVtby1wcm9qZWN0JztcclxuICAgIGNvbnN0IGlhdCA9IHRva2VuLmlhdCB8fCAwO1xyXG4gICAgY29uc3Qgc3ViID0gdG9rZW4uc3ViIHx8IHRva2VuLnVzZXJfaWQ7XHJcbiAgICBpZiAoIXN1Yikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIm1vY2tVc2VyVG9rZW4gbXVzdCBjb250YWluICdzdWInIG9yICd1c2VyX2lkJyBmaWVsZCFcIik7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXlsb2FkID0gT2JqZWN0LmFzc2lnbih7IFxyXG4gICAgICAgIC8vIFNldCBhbGwgcmVxdWlyZWQgZmllbGRzIHRvIGRlY2VudCBkZWZhdWx0c1xyXG4gICAgICAgIGlzczogYGh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS8ke3Byb2plY3R9YCwgYXVkOiBwcm9qZWN0LCBpYXQsIGV4cDogaWF0ICsgMzYwMCwgYXV0aF90aW1lOiBpYXQsIHN1YiwgdXNlcl9pZDogc3ViLCBmaXJlYmFzZToge1xyXG4gICAgICAgICAgICBzaWduX2luX3Byb3ZpZGVyOiAnY3VzdG9tJyxcclxuICAgICAgICAgICAgaWRlbnRpdGllczoge31cclxuICAgICAgICB9IH0sIHRva2VuKTtcclxuICAgIC8vIFVuc2VjdXJlZCBKV1RzIHVzZSB0aGUgZW1wdHkgc3RyaW5nIGFzIGEgc2lnbmF0dXJlLlxyXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gJyc7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKEpTT04uc3RyaW5naWZ5KGhlYWRlcikpLFxyXG4gICAgICAgIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKSxcclxuICAgICAgICBzaWduYXR1cmVcclxuICAgIF0uam9pbignLicpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IFN0YW5kYXJkaXplZCBGaXJlYmFzZSBFcnJvci5cclxuICpcclxuICogVXNhZ2U6XHJcbiAqXHJcbiAqICAgLy8gVHlwZXNjcmlwdCBzdHJpbmcgbGl0ZXJhbHMgZm9yIHR5cGUtc2FmZSBjb2Rlc1xyXG4gKiAgIHR5cGUgRXJyID1cclxuICogICAgICd1bmtub3duJyB8XHJcbiAqICAgICAnb2JqZWN0LW5vdC1mb3VuZCdcclxuICogICAgIDtcclxuICpcclxuICogICAvLyBDbG9zdXJlIGVudW0gZm9yIHR5cGUtc2FmZSBlcnJvciBjb2Rlc1xyXG4gKiAgIC8vIGF0LWVudW0ge3N0cmluZ31cclxuICogICB2YXIgRXJyID0ge1xyXG4gKiAgICAgVU5LTk9XTjogJ3Vua25vd24nLFxyXG4gKiAgICAgT0JKRUNUX05PVF9GT1VORDogJ29iamVjdC1ub3QtZm91bmQnLFxyXG4gKiAgIH1cclxuICpcclxuICogICBsZXQgZXJyb3JzOiBNYXA8RXJyLCBzdHJpbmc+ID0ge1xyXG4gKiAgICAgJ2dlbmVyaWMtZXJyb3InOiBcIlVua25vd24gZXJyb3JcIixcclxuICogICAgICdmaWxlLW5vdC1mb3VuZCc6IFwiQ291bGQgbm90IGZpbmQgZmlsZTogeyRmaWxlfVwiLFxyXG4gKiAgIH07XHJcbiAqXHJcbiAqICAgLy8gVHlwZS1zYWZlIGZ1bmN0aW9uIC0gbXVzdCBwYXNzIGEgdmFsaWQgZXJyb3IgY29kZSBhcyBwYXJhbS5cclxuICogICBsZXQgZXJyb3IgPSBuZXcgRXJyb3JGYWN0b3J5PEVycj4oJ3NlcnZpY2UnLCAnU2VydmljZScsIGVycm9ycyk7XHJcbiAqXHJcbiAqICAgLi4uXHJcbiAqICAgdGhyb3cgZXJyb3IuY3JlYXRlKEVyci5HRU5FUklDKTtcclxuICogICAuLi5cclxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkZJTEVfTk9UX0ZPVU5ELCB7J2ZpbGUnOiBmaWxlTmFtZX0pO1xyXG4gKiAgIC4uLlxyXG4gKiAgIC8vIFNlcnZpY2U6IENvdWxkIG5vdCBmaWxlIGZpbGU6IGZvby50eHQgKHNlcnZpY2UvZmlsZS1ub3QtZm91bmQpLlxyXG4gKlxyXG4gKiAgIGNhdGNoIChlKSB7XHJcbiAqICAgICBhc3NlcnQoZS5tZXNzYWdlID09PSBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IGZvby50eHQuXCIpO1xyXG4gKiAgICAgaWYgKChlIGFzIEZpcmViYXNlRXJyb3IpPy5jb2RlID09PSAnc2VydmljZS9maWxlLW5vdC1mb3VuZCcpIHtcclxuICogICAgICAgY29uc29sZS5sb2coXCJDb3VsZCBub3QgcmVhZCBmaWxlOiBcIiArIGVbJ2ZpbGUnXSk7XHJcbiAqICAgICB9XHJcbiAqICAgfVxyXG4gKi9cclxuY29uc3QgRVJST1JfTkFNRSA9ICdGaXJlYmFzZUVycm9yJztcclxuLy8gQmFzZWQgb24gY29kZSBmcm9tOlxyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9FcnJvciNDdXN0b21fRXJyb3JfVHlwZXNcclxuY2xhc3MgRmlyZWJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgLyoqIFRoZSBlcnJvciBjb2RlIGZvciB0aGlzIGVycm9yLiAqL1xyXG4gICAgY29kZSwgbWVzc2FnZSwgXHJcbiAgICAvKiogQ3VzdG9tIGRhdGEgZm9yIHRoaXMgZXJyb3IuICovXHJcbiAgICBjdXN0b21EYXRhKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuICAgICAgICB0aGlzLmN1c3RvbURhdGEgPSBjdXN0b21EYXRhO1xyXG4gICAgICAgIC8qKiBUaGUgY3VzdG9tIG5hbWUgZm9yIGFsbCBGaXJlYmFzZUVycm9ycy4gKi9cclxuICAgICAgICB0aGlzLm5hbWUgPSBFUlJPUl9OQU1FO1xyXG4gICAgICAgIC8vIEZpeCBGb3IgRVM1XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LXdpa2kvYmxvYi9tYXN0ZXIvQnJlYWtpbmctQ2hhbmdlcy5tZCNleHRlbmRpbmctYnVpbHQtaW5zLWxpa2UtZXJyb3ItYXJyYXktYW5kLW1hcC1tYXktbm8tbG9uZ2VyLXdvcmtcclxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgRmlyZWJhc2VFcnJvci5wcm90b3R5cGUpO1xyXG4gICAgICAgIC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgZm9yIHdoZXJlIG91ciBlcnJvciB3YXMgdGhyb3duLlxyXG4gICAgICAgIC8vIE9ubHkgYXZhaWxhYmxlIG9uIFY4LlxyXG4gICAgICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xyXG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFcnJvckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmNsYXNzIEVycm9yRmFjdG9yeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlLCBzZXJ2aWNlTmFtZSwgZXJyb3JzKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlID0gc2VydmljZTtcclxuICAgICAgICB0aGlzLnNlcnZpY2VOYW1lID0gc2VydmljZU5hbWU7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoY29kZSwgLi4uZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGN1c3RvbURhdGEgPSBkYXRhWzBdIHx8IHt9O1xyXG4gICAgICAgIGNvbnN0IGZ1bGxDb2RlID0gYCR7dGhpcy5zZXJ2aWNlfS8ke2NvZGV9YDtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuZXJyb3JzW2NvZGVdO1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0ZW1wbGF0ZSA/IHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgY3VzdG9tRGF0YSkgOiAnRXJyb3InO1xyXG4gICAgICAgIC8vIFNlcnZpY2UgTmFtZTogRXJyb3IgbWVzc2FnZSAoc2VydmljZS9jb2RlKS5cclxuICAgICAgICBjb25zdCBmdWxsTWVzc2FnZSA9IGAke3RoaXMuc2VydmljZU5hbWV9OiAke21lc3NhZ2V9ICgke2Z1bGxDb2RlfSkuYDtcclxuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBGaXJlYmFzZUVycm9yKGZ1bGxDb2RlLCBmdWxsTWVzc2FnZSwgY3VzdG9tRGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGF0YSkge1xyXG4gICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoUEFUVEVSTiwgKF8sIGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVtrZXldO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsID8gU3RyaW5nKHZhbHVlKSA6IGA8JHtrZXl9Pz5gO1xyXG4gICAgfSk7XHJcbn1cclxuY29uc3QgUEFUVEVSTiA9IC9cXHtcXCQoW159XSspfS9nO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRXZhbHVhdGVzIGEgSlNPTiBzdHJpbmcgaW50byBhIGphdmFzY3JpcHQgb2JqZWN0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIEEgc3RyaW5nIGNvbnRhaW5pbmcgSlNPTi5cclxuICogQHJldHVybiB7Kn0gVGhlIGphdmFzY3JpcHQgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3BlY2lmaWVkIEpTT04uXHJcbiAqL1xyXG5mdW5jdGlvbiBqc29uRXZhbChzdHIpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKHN0cik7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgSlNPTiByZXByZXNlbnRpbmcgYSBqYXZhc2NyaXB0IG9iamVjdC5cclxuICogQHBhcmFtIHsqfSBkYXRhIEphdmFzY3JpcHQgb2JqZWN0IHRvIGJlIHN0cmluZ2lmaWVkLlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBKU09OIGNvbnRlbnRzIG9mIHRoZSBvYmplY3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdHJpbmdpZnkoZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gaW50byBjb25zdGl0dWVudCBwYXJ0cy5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiB3aXRoIGludmFsaWQgLyBpbmNvbXBsZXRlIGNsYWltcyBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGRlY29kZSA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgbGV0IGhlYWRlciA9IHt9LCBjbGFpbXMgPSB7fSwgZGF0YSA9IHt9LCBzaWduYXR1cmUgPSAnJztcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcGFydHMgPSB0b2tlbi5zcGxpdCgnLicpO1xyXG4gICAgICAgIGhlYWRlciA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1swXSkgfHwgJycpO1xyXG4gICAgICAgIGNsYWltcyA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1sxXSkgfHwgJycpO1xyXG4gICAgICAgIHNpZ25hdHVyZSA9IHBhcnRzWzJdO1xyXG4gICAgICAgIGRhdGEgPSBjbGFpbXNbJ2QnXSB8fCB7fTtcclxuICAgICAgICBkZWxldGUgY2xhaW1zWydkJ107XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhlYWRlcixcclxuICAgICAgICBjbGFpbXMsXHJcbiAgICAgICAgZGF0YSxcclxuICAgICAgICBzaWduYXR1cmVcclxuICAgIH07XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIHRpbWUtYmFzZWQgY2xhaW1zLiBXaWxsIHJldHVybiB0cnVlIGlmIHRoZVxyXG4gKiB0b2tlbiBpcyB3aXRoaW4gdGhlIHRpbWUgd2luZG93IGF1dGhvcml6ZWQgYnkgdGhlICduYmYnIChub3QtYmVmb3JlKSBhbmQgJ2lhdCcgKGlzc3VlZC1hdCkgY2xhaW1zLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc1ZhbGlkVGltZXN0YW1wID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBjbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcclxuICAgIGNvbnN0IG5vdyA9IE1hdGguZmxvb3IobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgIGxldCB2YWxpZFNpbmNlID0gMCwgdmFsaWRVbnRpbCA9IDA7XHJcbiAgICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCduYmYnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWyduYmYnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWydpYXQnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnZXhwJykpIHtcclxuICAgICAgICAgICAgdmFsaWRVbnRpbCA9IGNsYWltc1snZXhwJ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0b2tlbiB3aWxsIGV4cGlyZSBhZnRlciAyNGggYnkgZGVmYXVsdFxyXG4gICAgICAgICAgICB2YWxpZFVudGlsID0gdmFsaWRTaW5jZSArIDg2NDAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAoISFub3cgJiZcclxuICAgICAgICAhIXZhbGlkU2luY2UgJiZcclxuICAgICAgICAhIXZhbGlkVW50aWwgJiZcclxuICAgICAgICBub3cgPj0gdmFsaWRTaW5jZSAmJlxyXG4gICAgICAgIG5vdyA8PSB2YWxpZFVudGlsKTtcclxufTtcclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgcmV0dXJucyBpdHMgaXNzdWVkIGF0IHRpbWUgaWYgdmFsaWQsIG51bGwgb3RoZXJ3aXNlLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIG51bGwgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc3N1ZWRBdFRpbWUgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xyXG4gICAgaWYgKHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcclxuICAgICAgICByZXR1cm4gY2xhaW1zWydpYXQnXTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCBjaGVja3MgdGhlIHZhbGlkaXR5IG9mIGl0cyBmb3JtYXQuIEV4cGVjdHMgYSB2YWxpZCBpc3N1ZWQtYXQgdGltZS5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNWYWxpZEZvcm1hdCA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgZGVjb2RlZCA9IGRlY29kZSh0b2tlbiksIGNsYWltcyA9IGRlY29kZWQuY2xhaW1zO1xyXG4gICAgcmV0dXJuICEhY2xhaW1zICYmIHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0Jyk7XHJcbn07XHJcbi8qKlxyXG4gKiBBdHRlbXB0cyB0byBwZWVyIGludG8gYW4gYXV0aCB0b2tlbiBhbmQgZGV0ZXJtaW5lIGlmIGl0J3MgYW4gYWRtaW4gYXV0aCB0b2tlbiBieSBsb29raW5nIGF0IHRoZSBjbGFpbXMgcG9ydGlvbi5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNBZG1pbiA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICByZXR1cm4gdHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zWydhZG1pbiddID09PSB0cnVlO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBjb250YWlucyhvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XHJcbn1cclxuZnVuY3Rpb24gc2FmZUdldChvYmosIGtleSkge1xyXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICByZXR1cm4gb2JqW2tleV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcclxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gbWFwKG9iaiwgZm4sIGNvbnRleHRPYmopIHtcclxuICAgIGNvbnN0IHJlcyA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICAgICAgcmVzW2tleV0gPSBmbi5jYWxsKGNvbnRleHRPYmosIG9ialtrZXldLCBrZXksIG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKipcclxuICogRGVlcCBlcXVhbCB0d28gb2JqZWN0cy4gU3VwcG9ydCBBcnJheXMgYW5kIE9iamVjdHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwRXF1YWwoYSwgYikge1xyXG4gICAgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGFLZXlzID0gT2JqZWN0LmtleXMoYSk7XHJcbiAgICBjb25zdCBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xyXG4gICAgZm9yIChjb25zdCBrIG9mIGFLZXlzKSB7XHJcbiAgICAgICAgaWYgKCFiS2V5cy5pbmNsdWRlcyhrKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFQcm9wID0gYVtrXTtcclxuICAgICAgICBjb25zdCBiUHJvcCA9IGJba107XHJcbiAgICAgICAgaWYgKGlzT2JqZWN0KGFQcm9wKSAmJiBpc09iamVjdChiUHJvcCkpIHtcclxuICAgICAgICAgICAgaWYgKCFkZWVwRXF1YWwoYVByb3AsIGJQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFQcm9wICE9PSBiUHJvcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBrIG9mIGJLZXlzKSB7XHJcbiAgICAgICAgaWYgKCFhS2V5cy5pbmNsdWRlcyhrKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gaXNPYmplY3QodGhpbmcpIHtcclxuICAgIHJldHVybiB0aGluZyAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZWplY3RzIGlmIHRoZSBnaXZlbiBwcm9taXNlIGRvZXNuJ3QgcmVzb2x2ZSBpbiB0aW1lSW5NUyBtaWxsaXNlY29uZHMuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gcHJvbWlzZVdpdGhUaW1lb3V0KHByb21pc2UsIHRpbWVJbk1TID0gMjAwMCkge1xyXG4gICAgY29uc3QgZGVmZXJyZWRQcm9taXNlID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGRlZmVycmVkUHJvbWlzZS5yZWplY3QoJ3RpbWVvdXQhJyksIHRpbWVJbk1TKTtcclxuICAgIHByb21pc2UudGhlbihkZWZlcnJlZFByb21pc2UucmVzb2x2ZSwgZGVmZXJyZWRQcm9taXNlLnJlamVjdCk7XHJcbiAgICByZXR1cm4gZGVmZXJyZWRQcm9taXNlLnByb21pc2U7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSBxdWVyeXN0cmluZy1mb3JtYXR0ZWQgc3RyaW5nIChlLmcuICZhcmc9dmFsJmFyZzI9dmFsMikgZnJvbSBhXHJcbiAqIHBhcmFtcyBvYmplY3QgKGUuZy4ge2FyZzogJ3ZhbCcsIGFyZzI6ICd2YWwyJ30pXHJcbiAqIE5vdGU6IFlvdSBtdXN0IHByZXBlbmQgaXQgd2l0aCA/IHdoZW4gYWRkaW5nIGl0IHRvIGEgVVJMLlxyXG4gKi9cclxuZnVuY3Rpb24gcXVlcnlzdHJpbmcocXVlcnlzdHJpbmdQYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocXVlcnlzdHJpbmdQYXJhbXMpKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlLmZvckVhY2goYXJyYXlWYWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoYXJyYXlWYWwpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYXJhbXMubGVuZ3RoID8gJyYnICsgcGFyYW1zLmpvaW4oJyYnKSA6ICcnO1xyXG59XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgcXVlcnlzdHJpbmcgKGUuZy4gP2FyZz12YWwmYXJnMj12YWwyKSBpbnRvIGEgcGFyYW1zIG9iamVjdFxyXG4gKiAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcclxuICovXHJcbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nRGVjb2RlKHF1ZXJ5c3RyaW5nKSB7XHJcbiAgICBjb25zdCBvYmogPSB7fTtcclxuICAgIGNvbnN0IHRva2VucyA9IHF1ZXJ5c3RyaW5nLnJlcGxhY2UoL15cXD8vLCAnJykuc3BsaXQoJyYnKTtcclxuICAgIHRva2Vucy5mb3JFYWNoKHRva2VuID0+IHtcclxuICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gdG9rZW4uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChrZXkpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcbi8qKlxyXG4gKiBFeHRyYWN0IHRoZSBxdWVyeSBzdHJpbmcgcGFydCBvZiBhIFVSTCwgaW5jbHVkaW5nIHRoZSBsZWFkaW5nIHF1ZXN0aW9uIG1hcmsgKGlmIHByZXNlbnQpLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFjdFF1ZXJ5c3RyaW5nKHVybCkge1xyXG4gICAgY29uc3QgcXVlcnlTdGFydCA9IHVybC5pbmRleE9mKCc/Jyk7XHJcbiAgICBpZiAoIXF1ZXJ5U3RhcnQpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBmcmFnbWVudFN0YXJ0ID0gdXJsLmluZGV4T2YoJyMnLCBxdWVyeVN0YXJ0KTtcclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHF1ZXJ5U3RhcnQsIGZyYWdtZW50U3RhcnQgPiAwID8gZnJhZ21lbnRTdGFydCA6IHVuZGVmaW5lZCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoLlxyXG4gKiBWYXJpYWJsZSBuYW1lcyBmb2xsb3cgdGhlIG5vdGF0aW9uIGluIEZJUFMgUFVCIDE4MC0zOlxyXG4gKiBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTMvZmlwczE4MC0zX2ZpbmFsLnBkZi5cclxuICpcclxuICogVXNhZ2U6XHJcbiAqICAgdmFyIHNoYTEgPSBuZXcgc2hhMSgpO1xyXG4gKiAgIHNoYTEudXBkYXRlKGJ5dGVzKTtcclxuICogICB2YXIgaGFzaCA9IHNoYTEuZGlnZXN0KCk7XHJcbiAqXHJcbiAqIFBlcmZvcm1hbmNlOlxyXG4gKiAgIENocm9tZSAyMzogICB+NDAwIE1iaXQvc1xyXG4gKiAgIEZpcmVmb3ggMTY6ICB+MjUwIE1iaXQvc1xyXG4gKlxyXG4gKi9cclxuLyoqXHJcbiAqIFNIQS0xIGNyeXB0b2dyYXBoaWMgaGFzaCBjb25zdHJ1Y3Rvci5cclxuICpcclxuICogVGhlIHByb3BlcnRpZXMgZGVjbGFyZWQgaGVyZSBhcmUgZGlzY3Vzc2VkIGluIHRoZSBhYm92ZSBhbGdvcml0aG0gZG9jdW1lbnQuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZmluYWxcclxuICogQHN0cnVjdFxyXG4gKi9cclxuY2xhc3MgU2hhMSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIb2xkcyB0aGUgcHJldmlvdXMgdmFsdWVzIG9mIGFjY3VtdWxhdGVkIHZhcmlhYmxlcyBhLWUgaW4gdGhlIGNvbXByZXNzX1xyXG4gICAgICAgICAqIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jaGFpbl8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBIGJ1ZmZlciBob2xkaW5nIHRoZSBwYXJ0aWFsbHkgY29tcHV0ZWQgaGFzaCByZXN1bHQuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJ1Zl8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBbiBhcnJheSBvZiA4MCBieXRlcywgZWFjaCBhIHBhcnQgb2YgdGhlIG1lc3NhZ2UgdG8gYmUgaGFzaGVkLiAgUmVmZXJyZWQgdG9cclxuICAgICAgICAgKiBhcyB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpbiB0aGUgZG9jcy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuV18gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb250YWlucyBkYXRhIG5lZWRlZCB0byBwYWQgbWVzc2FnZXMgbGVzcyB0aGFuIDY0IGJ5dGVzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5wYWRfID0gW107XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHByaXZhdGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHByaXZhdGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRvdGFsXyA9IDA7XHJcbiAgICAgICAgdGhpcy5ibG9ja1NpemUgPSA1MTIgLyA4O1xyXG4gICAgICAgIHRoaXMucGFkX1swXSA9IDEyODtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuYmxvY2tTaXplOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWRfW2ldID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMF0gPSAweDY3NDUyMzAxO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzFdID0gMHhlZmNkYWI4OTtcclxuICAgICAgICB0aGlzLmNoYWluX1syXSA9IDB4OThiYWRjZmU7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bM10gPSAweDEwMzI1NDc2O1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzRdID0gMHhjM2QyZTFmMDtcclxuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XHJcbiAgICAgICAgdGhpcy50b3RhbF8gPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcm5hbCBjb21wcmVzcyBoZWxwZXIgZnVuY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0gYnVmIEJsb2NrIHRvIGNvbXByZXNzLlxyXG4gICAgICogQHBhcmFtIG9mZnNldCBPZmZzZXQgb2YgdGhlIGJsb2NrIGluIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjb21wcmVzc18oYnVmLCBvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBXID0gdGhpcy5XXztcclxuICAgICAgICAvLyBnZXQgMTYgYmlnIGVuZGlhbiB3b3Jkc1xyXG4gICAgICAgIGlmICh0eXBlb2YgYnVmID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE8odXNlcik6IFtidWcgODE0MDEyMl0gUmVjZW50IHZlcnNpb25zIG9mIFNhZmFyaSBmb3IgTWFjIE9TIGFuZCBpT1NcclxuICAgICAgICAgICAgICAgIC8vIGhhdmUgYSBidWcgdGhhdCB0dXJucyB0aGUgcG9zdC1pbmNyZW1lbnQgKysgb3BlcmF0b3IgaW50byBwcmUtaW5jcmVtZW50XHJcbiAgICAgICAgICAgICAgICAvLyBkdXJpbmcgSklUIGNvbXBpbGF0aW9uLiAgV2UgaGF2ZSBjb2RlIHRoYXQgZGVwZW5kcyBoZWF2aWx5IG9uIFNIQS0xIGZvclxyXG4gICAgICAgICAgICAgICAgLy8gY29ycmVjdG5lc3MgYW5kIHdoaWNoIGlzIGFmZmVjdGVkIGJ5IHRoaXMgYnVnLCBzbyBJJ3ZlIHJlbW92ZWQgYWxsIHVzZXNcclxuICAgICAgICAgICAgICAgIC8vIG9mIHBvc3QtaW5jcmVtZW50ICsrIGluIHdoaWNoIHRoZSByZXN1bHQgdmFsdWUgaXMgdXNlZC4gIFdlIGNhbiByZXZlcnRcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY2hhbmdlIG9uY2UgdGhlIFNhZmFyaSBidWdcclxuICAgICAgICAgICAgICAgIC8vIChodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTA5MDM2KSBoYXMgYmVlbiBmaXhlZCBhbmRcclxuICAgICAgICAgICAgICAgIC8vIG1vc3QgY2xpZW50cyBoYXZlIGJlZW4gdXBkYXRlZC5cclxuICAgICAgICAgICAgICAgIFdbaV0gPVxyXG4gICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQpIDw8IDI0KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAxKSA8PCAxNikgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMikgPDwgOCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWYuY2hhckNvZGVBdChvZmZzZXQgKyAzKTtcclxuICAgICAgICAgICAgICAgIG9mZnNldCArPSA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIFdbaV0gPVxyXG4gICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0XSA8PCAyNCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmW29mZnNldCArIDFdIDw8IDE2KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0ICsgMl0gPDwgOCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZbb2Zmc2V0ICsgM107XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBleHBhbmQgdG8gODAgd29yZHNcclxuICAgICAgICBmb3IgKGxldCBpID0gMTY7IGkgPCA4MDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdO1xyXG4gICAgICAgICAgICBXW2ldID0gKCh0IDw8IDEpIHwgKHQgPj4+IDMxKSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYSA9IHRoaXMuY2hhaW5fWzBdO1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5jaGFpbl9bMV07XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLmNoYWluX1syXTtcclxuICAgICAgICBsZXQgZCA9IHRoaXMuY2hhaW5fWzNdO1xyXG4gICAgICAgIGxldCBlID0gdGhpcy5jaGFpbl9bNF07XHJcbiAgICAgICAgbGV0IGYsIGs7XHJcbiAgICAgICAgLy8gVE9ETyh1c2VyKTogVHJ5IHRvIHVucm9sbCB0aGlzIGxvb3AgdG8gc3BlZWQgdXAgdGhlIGNvbXB1dGF0aW9uLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODA7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDQwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDIwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGQgXiAoYiAmIChjIF4gZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweDVhODI3OTk5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGIgXiBjIF4gZDtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHg2ZWQ5ZWJhMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgNjApIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gKGIgJiBjKSB8IChkICYgKGIgfCBjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4OGYxYmJjZGM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweGNhNjJjMWQ2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSAoKChhIDw8IDUpIHwgKGEgPj4+IDI3KSkgKyBmICsgZSArIGsgKyBXW2ldKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgICAgIGUgPSBkO1xyXG4gICAgICAgICAgICBkID0gYztcclxuICAgICAgICAgICAgYyA9ICgoYiA8PCAzMCkgfCAoYiA+Pj4gMikpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICAgICAgYiA9IGE7XHJcbiAgICAgICAgICAgIGEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoYWluX1swXSA9ICh0aGlzLmNoYWluX1swXSArIGEpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1sxXSA9ICh0aGlzLmNoYWluX1sxXSArIGIpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1syXSA9ICh0aGlzLmNoYWluX1syXSArIGMpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1szXSA9ICh0aGlzLmNoYWluX1szXSArIGQpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1s0XSA9ICh0aGlzLmNoYWluX1s0XSArIGUpICYgMHhmZmZmZmZmZjtcclxuICAgIH1cclxuICAgIHVwZGF0ZShieXRlcywgbGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gVE9ETyhqb2hubGVueik6IHRpZ2h0ZW4gdGhlIGZ1bmN0aW9uIHNpZ25hdHVyZSBhbmQgcmVtb3ZlIHRoaXMgY2hlY2tcclxuICAgICAgICBpZiAoYnl0ZXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBieXRlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxlbmd0aE1pbnVzQmxvY2sgPSBsZW5ndGggLSB0aGlzLmJsb2NrU2l6ZTtcclxuICAgICAgICBsZXQgbiA9IDA7XHJcbiAgICAgICAgLy8gVXNpbmcgbG9jYWwgaW5zdGVhZCBvZiBtZW1iZXIgdmFyaWFibGVzIGdpdmVzIH41JSBzcGVlZHVwIG9uIEZpcmVmb3ggMTYuXHJcbiAgICAgICAgY29uc3QgYnVmID0gdGhpcy5idWZfO1xyXG4gICAgICAgIGxldCBpbmJ1ZiA9IHRoaXMuaW5idWZfO1xyXG4gICAgICAgIC8vIFRoZSBvdXRlciB3aGlsZSBsb29wIHNob3VsZCBleGVjdXRlIGF0IG1vc3QgdHdpY2UuXHJcbiAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gV2hlbiB3ZSBoYXZlIG5vIGRhdGEgaW4gdGhlIGJsb2NrIHRvIHRvcCB1cCwgd2UgY2FuIGRpcmVjdGx5IHByb2Nlc3MgdGhlXHJcbiAgICAgICAgICAgIC8vIGlucHV0IGJ1ZmZlciAoYXNzdW1pbmcgaXQgY29udGFpbnMgc3VmZmljaWVudCBkYXRhKS4gVGhpcyBnaXZlcyB+MjUlXHJcbiAgICAgICAgICAgIC8vIHNwZWVkdXAgb24gQ2hyb21lIDIzIGFuZCB+MTUlIHNwZWVkdXAgb24gRmlyZWZveCAxNiwgYnV0IHJlcXVpcmVzIHRoYXRcclxuICAgICAgICAgICAgLy8gdGhlIGRhdGEgaXMgcHJvdmlkZWQgaW4gbGFyZ2UgY2h1bmtzIChvciBpbiBtdWx0aXBsZXMgb2YgNjQgYnl0ZXMpLlxyXG4gICAgICAgICAgICBpZiAoaW5idWYgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuIDw9IGxlbmd0aE1pbnVzQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhieXRlcywgbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbiArPSB0aGlzLmJsb2NrU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZbaW5idWZdID0gYnl0ZXMuY2hhckNvZGVBdChuKTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlc1tuXTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmJ1Zl8gPSBpbmJ1ZjtcclxuICAgICAgICB0aGlzLnRvdGFsXyArPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICBkaWdlc3QoKSB7XHJcbiAgICAgICAgY29uc3QgZGlnZXN0ID0gW107XHJcbiAgICAgICAgbGV0IHRvdGFsQml0cyA9IHRoaXMudG90YWxfICogODtcclxuICAgICAgICAvLyBBZGQgcGFkIDB4ODAgMHgwMCouXHJcbiAgICAgICAgaWYgKHRoaXMuaW5idWZfIDwgNTYpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCA1NiAtIHRoaXMuaW5idWZfKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucGFkXywgdGhpcy5ibG9ja1NpemUgLSAodGhpcy5pbmJ1Zl8gLSA1NikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBZGQgIyBiaXRzLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLmJsb2NrU2l6ZSAtIDE7IGkgPj0gNTY7IGktLSkge1xyXG4gICAgICAgICAgICB0aGlzLmJ1Zl9baV0gPSB0b3RhbEJpdHMgJiAyNTU7XHJcbiAgICAgICAgICAgIHRvdGFsQml0cyAvPSAyNTY7IC8vIERvbid0IHVzZSBiaXQtc2hpZnRpbmcgaGVyZSFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wcmVzc18odGhpcy5idWZfKTtcclxuICAgICAgICBsZXQgbiA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDI0OyBqID49IDA7IGogLT0gOCkge1xyXG4gICAgICAgICAgICAgICAgZGlnZXN0W25dID0gKHRoaXMuY2hhaW5fW2ldID4+IGopICYgMjU1O1xyXG4gICAgICAgICAgICAgICAgKytuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaWdlc3Q7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEhlbHBlciB0byBtYWtlIGEgU3Vic2NyaWJlIGZ1bmN0aW9uIChqdXN0IGxpa2UgUHJvbWlzZSBoZWxwcyBtYWtlIGFcclxuICogVGhlbmFibGUpLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcclxuICogICAgIGFzIGEgcHJveHkuXHJcbiAqIEBwYXJhbSBvbk5vT2JzZXJ2ZXJzIENhbGxiYWNrIHdoZW4gY291bnQgb2YgT2JzZXJ2ZXJzIGdvZXMgdG8gemVyby5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVN1YnNjcmliZShleGVjdXRvciwgb25Ob09ic2VydmVycykge1xyXG4gICAgY29uc3QgcHJveHkgPSBuZXcgT2JzZXJ2ZXJQcm94eShleGVjdXRvciwgb25Ob09ic2VydmVycyk7XHJcbiAgICByZXR1cm4gcHJveHkuc3Vic2NyaWJlLmJpbmQocHJveHkpO1xyXG59XHJcbi8qKlxyXG4gKiBJbXBsZW1lbnQgZmFuLW91dCBmb3IgYW55IG51bWJlciBvZiBPYnNlcnZlcnMgYXR0YWNoZWQgdmlhIGEgc3Vic2NyaWJlXHJcbiAqIGZ1bmN0aW9uLlxyXG4gKi9cclxuY2xhc3MgT2JzZXJ2ZXJQcm94eSB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBleGVjdXRvciBGdW5jdGlvbiB3aGljaCBjYW4gbWFrZSBjYWxscyB0byBhIHNpbmdsZSBPYnNlcnZlclxyXG4gICAgICogICAgIGFzIGEgcHJveHkuXHJcbiAgICAgKiBAcGFyYW0gb25Ob09ic2VydmVycyBDYWxsYmFjayB3aGVuIGNvdW50IG9mIE9ic2VydmVycyBnb2VzIHRvIHplcm8uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCA9IDA7XHJcbiAgICAgICAgLy8gTWljcm8tdGFzayBzY2hlZHVsaW5nIGJ5IGNhbGxpbmcgdGFzay50aGVuKCkuXHJcbiAgICAgICAgdGhpcy50YXNrID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgdGhpcy5maW5hbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnMgPSBvbk5vT2JzZXJ2ZXJzO1xyXG4gICAgICAgIC8vIENhbGwgdGhlIGV4ZWN1dG9yIGFzeW5jaHJvbm91c2x5IHNvIHN1YnNjcmliZXJzIHRoYXQgYXJlIGNhbGxlZFxyXG4gICAgICAgIC8vIHN5bmNocm9ub3VzbHkgYWZ0ZXIgdGhlIGNyZWF0aW9uIG9mIHRoZSBzdWJzY3JpYmUgZnVuY3Rpb25cclxuICAgICAgICAvLyBjYW4gc3RpbGwgcmVjZWl2ZSB0aGUgdmVyeSBmaXJzdCB2YWx1ZSBnZW5lcmF0ZWQgaW4gdGhlIGV4ZWN1dG9yLlxyXG4gICAgICAgIHRoaXMudGFza1xyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4ZWN1dG9yKHRoaXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5leHQodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlcnJvcihlcnJvcikge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jbG9zZShlcnJvcik7XHJcbiAgICB9XHJcbiAgICBjb21wbGV0ZSgpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBhbiBPYnNlcnZlciB0byB0aGUgZmFuLW91dCBsaXN0LlxyXG4gICAgICpcclxuICAgICAqIC0gV2UgcmVxdWlyZSB0aGF0IG5vIGV2ZW50IGlzIHNlbnQgdG8gYSBzdWJzY3JpYmVyIHN5Y2hyb25vdXNseSB0byB0aGVpclxyXG4gICAgICogICBjYWxsIHRvIHN1YnNjcmliZSgpLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmUobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSkge1xyXG4gICAgICAgIGxldCBvYnNlcnZlcjtcclxuICAgICAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgPT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBlcnJvciA9PT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIE9ic2VydmVyLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBc3NlbWJsZSBhbiBPYnNlcnZlciBvYmplY3Qgd2hlbiBwYXNzZWQgYXMgY2FsbGJhY2sgZnVuY3Rpb25zLlxyXG4gICAgICAgIGlmIChpbXBsZW1lbnRzQW55TWV0aG9kcyhuZXh0T3JPYnNlcnZlciwgW1xyXG4gICAgICAgICAgICAnbmV4dCcsXHJcbiAgICAgICAgICAgICdlcnJvcicsXHJcbiAgICAgICAgICAgICdjb21wbGV0ZSdcclxuICAgICAgICBdKSkge1xyXG4gICAgICAgICAgICBvYnNlcnZlciA9IG5leHRPck9ic2VydmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0OiBuZXh0T3JPYnNlcnZlcixcclxuICAgICAgICAgICAgICAgIGVycm9yLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLm5leHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0ID0gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLmVycm9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IgPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JzZXJ2ZXIuY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSA9IG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHVuc3ViID0gdGhpcy51bnN1YnNjcmliZU9uZS5iaW5kKHRoaXMsIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBzdWJzY3JpYmUgdG8gYSB0ZXJtaW5hdGVkIE9ic2VydmFibGUgLSB3ZVxyXG4gICAgICAgIC8vIGp1c3QgcmVzcG9uZCB0byB0aGUgT2JzZXJ2ZXIgd2l0aCB0aGUgZmluYWwgZXJyb3Igb3IgY29tcGxldGVcclxuICAgICAgICAvLyBldmVudC5cclxuICAgICAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgICAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbmFsRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IodGhpcy5maW5hbEVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcclxuICAgICAgICByZXR1cm4gdW5zdWI7XHJcbiAgICB9XHJcbiAgICAvLyBVbnN1YnNjcmliZSBpcyBzeW5jaHJvbm91cyAtIHdlIGd1YXJhbnRlZSB0aGF0IG5vIGV2ZW50cyBhcmUgc2VudCB0b1xyXG4gICAgLy8gYW55IHVuc3Vic2NyaWJlZCBPYnNlcnZlci5cclxuICAgIHVuc3Vic2NyaWJlT25lKGkpIHtcclxuICAgICAgICBpZiAodGhpcy5vYnNlcnZlcnMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm9ic2VydmVyc1tpXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2ldO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCAtPSAxO1xyXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyQ291bnQgPT09IDAgJiYgdGhpcy5vbk5vT2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvckVhY2hPYnNlcnZlcihmbikge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICAvLyBBbHJlYWR5IGNsb3NlZCBieSBwcmV2aW91cyBldmVudC4uLi5qdXN0IGVhdCB0aGUgYWRkaXRpb25hbCB2YWx1ZXMuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2luY2Ugc2VuZE9uZSBjYWxscyBhc3luY2hyb25vdXNseSAtIHRoZXJlIGlzIG5vIGNoYW5jZSB0aGF0XHJcbiAgICAgICAgLy8gdGhpcy5vYnNlcnZlcnMgd2lsbCBiZWNvbWUgdW5kZWZpbmVkLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kT25lKGksIGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBDYWxsIHRoZSBPYnNlcnZlciB2aWEgb25lIG9mIGl0J3MgY2FsbGJhY2sgZnVuY3Rpb24uIFdlIGFyZSBjYXJlZnVsIHRvXHJcbiAgICAvLyBjb25maXJtIHRoYXQgdGhlIG9ic2VydmUgaGFzIG5vdCBiZWVuIHVuc3Vic2NyaWJlZCBzaW5jZSB0aGlzIGFzeW5jaHJvbm91c1xyXG4gICAgLy8gZnVuY3Rpb24gaGFkIGJlZW4gcXVldWVkLlxyXG4gICAgc2VuZE9uZShpLCBmbikge1xyXG4gICAgICAgIC8vIEV4ZWN1dGUgdGhlIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vYnNlcnZlcnNbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBmbih0aGlzLm9ic2VydmVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zIHJhaXNlZCBpbiBPYnNlcnZlcnMgb3IgbWlzc2luZyBtZXRob2RzIG9mIGFuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT2JzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9nIGVycm9yIHRvIGNvbnNvbGUuIGIvMzE0MDQ4MDZcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlKGVycikge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5maW5hbEVycm9yID0gZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBQcm94eSBpcyBubyBsb25nZXIgbmVlZGVkIC0gZ2FyYmFnZSBjb2xsZWN0IHJlZmVyZW5jZXNcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmVycyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKiBUdXJuIHN5bmNocm9ub3VzIGZ1bmN0aW9uIGludG8gb25lIGNhbGxlZCBhc3luY2hyb25vdXNseS4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcclxuZnVuY3Rpb24gYXN5bmMoZm4sIG9uRXJyb3IpIHtcclxuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9uRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IHBhc3NlZCBpbiBpbXBsZW1lbnRzIGFueSBvZiB0aGUgbmFtZWQgbWV0aG9kcy5cclxuICovXHJcbmZ1bmN0aW9uIGltcGxlbWVudHNBbnlNZXRob2RzKG9iaiwgbWV0aG9kcykge1xyXG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgbWV0aG9kIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICBpZiAobWV0aG9kIGluIG9iaiAmJiB0eXBlb2Ygb2JqW21ldGhvZF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIG5vb3AoKSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgZm9yIGEgcHVibGljIGZ1bmN0aW9uLlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgaXQgZmFpbHMuXHJcbiAqXHJcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcclxuICogQHBhcmFtIG1pbkNvdW50IFRoZSBtaW5pbXVtIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBtYXhDb3VudCBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnQgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBhcmdDb3VudCBUaGUgYWN0dWFsIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQuXHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZUFyZ0NvdW50ID0gZnVuY3Rpb24gKGZuTmFtZSwgbWluQ291bnQsIG1heENvdW50LCBhcmdDb3VudCkge1xyXG4gICAgbGV0IGFyZ0Vycm9yO1xyXG4gICAgaWYgKGFyZ0NvdW50IDwgbWluQ291bnQpIHtcclxuICAgICAgICBhcmdFcnJvciA9ICdhdCBsZWFzdCAnICsgbWluQ291bnQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhcmdDb3VudCA+IG1heENvdW50KSB7XHJcbiAgICAgICAgYXJnRXJyb3IgPSBtYXhDb3VudCA9PT0gMCA/ICdub25lJyA6ICdubyBtb3JlIHRoYW4gJyArIG1heENvdW50O1xyXG4gICAgfVxyXG4gICAgaWYgKGFyZ0Vycm9yKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBmbk5hbWUgK1xyXG4gICAgICAgICAgICAnIGZhaWxlZDogV2FzIGNhbGxlZCB3aXRoICcgK1xyXG4gICAgICAgICAgICBhcmdDb3VudCArXHJcbiAgICAgICAgICAgIChhcmdDb3VudCA9PT0gMSA/ICcgYXJndW1lbnQuJyA6ICcgYXJndW1lbnRzLicpICtcclxuICAgICAgICAgICAgJyBFeHBlY3RzICcgK1xyXG4gICAgICAgICAgICBhcmdFcnJvciArXHJcbiAgICAgICAgICAgICcuJztcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogR2VuZXJhdGVzIGEgc3RyaW5nIHRvIHByZWZpeCBhbiBlcnJvciBtZXNzYWdlIGFib3V0IGZhaWxlZCBhcmd1bWVudCB2YWxpZGF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcclxuICogQHBhcmFtIGFyZ05hbWUgVGhlIG5hbWUgb2YgdGhlIGFyZ3VtZW50XHJcbiAqIEByZXR1cm4gVGhlIHByZWZpeCB0byBhZGQgdG8gdGhlIGVycm9yIHRocm93biBmb3IgdmFsaWRhdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGVycm9yUHJlZml4KGZuTmFtZSwgYXJnTmFtZSkge1xyXG4gICAgcmV0dXJuIGAke2ZuTmFtZX0gZmFpbGVkOiAke2FyZ05hbWV9IGFyZ3VtZW50IGA7XHJcbn1cclxuLyoqXHJcbiAqIEBwYXJhbSBmbk5hbWVcclxuICogQHBhcmFtIGFyZ3VtZW50TnVtYmVyXHJcbiAqIEBwYXJhbSBuYW1lc3BhY2VcclxuICogQHBhcmFtIG9wdGlvbmFsXHJcbiAqL1xyXG5mdW5jdGlvbiB2YWxpZGF0ZU5hbWVzcGFjZShmbk5hbWUsIG5hbWVzcGFjZSwgb3B0aW9uYWwpIHtcclxuICAgIGlmIChvcHRpb25hbCAmJiAhbmFtZXNwYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgLy9UT0RPOiBJIHNob3VsZCBkbyBtb3JlIHZhbGlkYXRpb24gaGVyZS4gV2Ugb25seSBhbGxvdyBjZXJ0YWluIGNoYXJzIGluIG5hbWVzcGFjZXMuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yUHJlZml4KGZuTmFtZSwgJ25hbWVzcGFjZScpICsgJ211c3QgYmUgYSB2YWxpZCBmaXJlYmFzZSBuYW1lc3BhY2UuJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdmFsaWRhdGVDYWxsYmFjayhmbk5hbWUsIGFyZ3VtZW50TmFtZSwgXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXHJcbmNhbGxiYWNrLCBvcHRpb25hbCkge1xyXG4gICAgaWYgKG9wdGlvbmFsICYmICFjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE5hbWUpICsgJ211c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi4nKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB2YWxpZGF0ZUNvbnRleHRPYmplY3QoZm5OYW1lLCBhcmd1bWVudE5hbWUsIGNvbnRleHQsIG9wdGlvbmFsKSB7XHJcbiAgICBpZiAob3B0aW9uYWwgJiYgIWNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdvYmplY3QnIHx8IGNvbnRleHQgPT09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE5hbWUpICsgJ211c3QgYmUgYSB2YWxpZCBjb250ZXh0IG9iamVjdC4nKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vLyBDb2RlIG9yaWdpbmFsbHkgY2FtZSBmcm9tIGdvb2cuY3J5cHQuc3RyaW5nVG9VdGY4Qnl0ZUFycmF5LCBidXQgZm9yIHNvbWUgcmVhc29uIHRoZXlcclxuLy8gYXV0b21hdGljYWxseSByZXBsYWNlZCAnXFxyXFxuJyB3aXRoICdcXG4nLCBhbmQgdGhleSBkaWRuJ3QgaGFuZGxlIHN1cnJvZ2F0ZSBwYWlycyxcclxuLy8gc28gaXQncyBiZWVuIG1vZGlmaWVkLlxyXG4vLyBOb3RlIHRoYXQgbm90IGFsbCBVbmljb2RlIGNoYXJhY3RlcnMgYXBwZWFyIGFzIHNpbmdsZSBjaGFyYWN0ZXJzIGluIEphdmFTY3JpcHQgc3RyaW5ncy5cclxuLy8gZnJvbUNoYXJDb2RlIHJldHVybnMgdGhlIFVURi0xNiBlbmNvZGluZyBvZiBhIGNoYXJhY3RlciAtIHNvIHNvbWUgVW5pY29kZSBjaGFyYWN0ZXJzXHJcbi8vIHVzZSAyIGNoYXJhY3RlcnMgaW4gSmF2YXNjcmlwdC4gIEFsbCA0LWJ5dGUgVVRGLTggY2hhcmFjdGVycyBiZWdpbiB3aXRoIGEgZmlyc3RcclxuLy8gY2hhcmFjdGVyIGluIHRoZSByYW5nZSAweEQ4MDAgLSAweERCRkYgKHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgYSBzby1jYWxsZWQgc3Vycm9nYXRlXHJcbi8vIHBhaXIpLlxyXG4vLyBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzUuMS8jc2VjLTE1LjEuM1xyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICovXHJcbmNvbnN0IHN0cmluZ1RvQnl0ZUFycmF5ID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgY29uc3Qgb3V0ID0gW107XHJcbiAgICBsZXQgcCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgLy8gSXMgdGhpcyB0aGUgbGVhZCBzdXJyb2dhdGUgaW4gYSBzdXJyb2dhdGUgcGFpcj9cclxuICAgICAgICBpZiAoYyA+PSAweGQ4MDAgJiYgYyA8PSAweGRiZmYpIHtcclxuICAgICAgICAgICAgY29uc3QgaGlnaCA9IGMgLSAweGQ4MDA7IC8vIHRoZSBoaWdoIDEwIGJpdHMuXHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgYXNzZXJ0KGkgPCBzdHIubGVuZ3RoLCAnU3Vycm9nYXRlIHBhaXIgbWlzc2luZyB0cmFpbCBzdXJyb2dhdGUuJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvdyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gMHhkYzAwOyAvLyB0aGUgbG93IDEwIGJpdHMuXHJcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKGhpZ2ggPDwgMTApICsgbG93O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCA2NTUzNikge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDEyKSB8IDIyNDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xyXG4vKipcclxuICogQ2FsY3VsYXRlIGxlbmd0aCB3aXRob3V0IGFjdHVhbGx5IGNvbnZlcnRpbmc7IHVzZWZ1bCBmb3IgZG9pbmcgY2hlYXBlciB2YWxpZGF0aW9uLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm4ge251bWJlcn1cclxuICovXHJcbmNvbnN0IHN0cmluZ0xlbmd0aCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGlmIChjIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIHArKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpIHtcclxuICAgICAgICAgICAgcCArPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xyXG4gICAgICAgICAgICAvLyBMZWFkIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyLiAgVGhlIHBhaXIgdG9nZXRoZXIgd2lsbCB0YWtlIDQgYnl0ZXMgdG8gcmVwcmVzZW50LlxyXG4gICAgICAgICAgICBwICs9IDQ7XHJcbiAgICAgICAgICAgIGkrKzsgLy8gc2tpcCB0cmFpbCBzdXJyb2dhdGUuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwICs9IDM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHA7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDb3BpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyM1xyXG4gKiBHZW5lcmF0ZXMgYSBuZXcgdXVpZC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgdXVpZHY0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgYyA9PiB7XHJcbiAgICAgICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCwgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XHJcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG4gICAgfSk7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaGUgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBleHBvbmVudGlhbGx5IGluY3JlYXNlLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9JTlRFUlZBTF9NSUxMSVMgPSAxMDAwO1xyXG4vKipcclxuICogVGhlIGZhY3RvciB0byBiYWNrb2ZmIGJ5LlxyXG4gKiBTaG91bGQgYmUgYSBudW1iZXIgZ3JlYXRlciB0aGFuIDEuXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0JBQ0tPRkZfRkFDVE9SID0gMjtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIG1pbGxpc2Vjb25kcyB0byBpbmNyZWFzZSB0by5cclxuICpcclxuICogPHA+VmlzaWJsZSBmb3IgdGVzdGluZ1xyXG4gKi9cclxuY29uc3QgTUFYX1ZBTFVFX01JTExJUyA9IDQgKiA2MCAqIDYwICogMTAwMDsgLy8gRm91ciBob3VycywgbGlrZSBpT1MgYW5kIEFuZHJvaWQuXHJcbi8qKlxyXG4gKiBUaGUgcGVyY2VudGFnZSBvZiBiYWNrb2ZmIHRpbWUgdG8gcmFuZG9taXplIGJ5LlxyXG4gKiBTZWVcclxuICogaHR0cDovL2dvL3NhZmUtY2xpZW50LWJlaGF2aW9yI3N0ZXAtMS1kZXRlcm1pbmUtdGhlLWFwcHJvcHJpYXRlLXJldHJ5LWludGVydmFsLXRvLWhhbmRsZS1zcGlrZS10cmFmZmljXHJcbiAqIGZvciBjb250ZXh0LlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXHJcbiAqL1xyXG5jb25zdCBSQU5ET01fRkFDVE9SID0gMC41O1xyXG4vKipcclxuICogQmFzZWQgb24gdGhlIGJhY2tvZmYgbWV0aG9kIGZyb21cclxuICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWxpYnJhcnkvYmxvYi9tYXN0ZXIvY2xvc3VyZS9nb29nL21hdGgvZXhwb25lbnRpYWxiYWNrb2ZmLmpzLlxyXG4gKiBFeHRyYWN0ZWQgaGVyZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHBhc3MgbWV0YWRhdGEgYW5kIGEgc3RhdGVmdWwgRXhwb25lbnRpYWxCYWNrb2ZmIG9iamVjdCBhcm91bmQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzKGJhY2tvZmZDb3VudCwgaW50ZXJ2YWxNaWxsaXMgPSBERUZBVUxUX0lOVEVSVkFMX01JTExJUywgYmFja29mZkZhY3RvciA9IERFRkFVTFRfQkFDS09GRl9GQUNUT1IpIHtcclxuICAgIC8vIENhbGN1bGF0ZXMgYW4gZXhwb25lbnRpYWxseSBpbmNyZWFzaW5nIHZhbHVlLlxyXG4gICAgLy8gRGV2aWF0aW9uOiBjYWxjdWxhdGVzIHZhbHVlIGZyb20gY291bnQgYW5kIGEgY29uc3RhbnQgaW50ZXJ2YWwsIHNvIHdlIG9ubHkgbmVlZCB0byBzYXZlIHZhbHVlXHJcbiAgICAvLyBhbmQgY291bnQgdG8gcmVzdG9yZSBzdGF0ZS5cclxuICAgIGNvbnN0IGN1cnJCYXNlVmFsdWUgPSBpbnRlcnZhbE1pbGxpcyAqIE1hdGgucG93KGJhY2tvZmZGYWN0b3IsIGJhY2tvZmZDb3VudCk7XHJcbiAgICAvLyBBIHJhbmRvbSBcImZ1enpcIiB0byBhdm9pZCB3YXZlcyBvZiByZXRyaWVzLlxyXG4gICAgLy8gRGV2aWF0aW9uOiByYW5kb21GYWN0b3IgaXMgcmVxdWlyZWQuXHJcbiAgICBjb25zdCByYW5kb21XYWl0ID0gTWF0aC5yb3VuZChcclxuICAgIC8vIEEgZnJhY3Rpb24gb2YgdGhlIGJhY2tvZmYgdmFsdWUgdG8gYWRkL3N1YnRyYWN0LlxyXG4gICAgLy8gRGV2aWF0aW9uOiBjaGFuZ2VzIG11bHRpcGxpY2F0aW9uIG9yZGVyIHRvIGltcHJvdmUgcmVhZGFiaWxpdHkuXHJcbiAgICBSQU5ET01fRkFDVE9SICpcclxuICAgICAgICBjdXJyQmFzZVZhbHVlICpcclxuICAgICAgICAvLyBBIHJhbmRvbSBmbG9hdCAocm91bmRlZCB0byBpbnQgYnkgTWF0aC5yb3VuZCBhYm92ZSkgaW4gdGhlIHJhbmdlIFstMSwgMV0uIERldGVybWluZXNcclxuICAgICAgICAvLyBpZiB3ZSBhZGQgb3Igc3VidHJhY3QuXHJcbiAgICAgICAgKE1hdGgucmFuZG9tKCkgLSAwLjUpICpcclxuICAgICAgICAyKTtcclxuICAgIC8vIExpbWl0cyBiYWNrb2ZmIHRvIG1heCB0byBhdm9pZCBlZmZlY3RpdmVseSBwZXJtYW5lbnQgYmFja29mZi5cclxuICAgIHJldHVybiBNYXRoLm1pbihNQVhfVkFMVUVfTUlMTElTLCBjdXJyQmFzZVZhbHVlICsgcmFuZG9tV2FpdCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFByb3ZpZGUgRW5nbGlzaCBvcmRpbmFsIGxldHRlcnMgYWZ0ZXIgYSBudW1iZXJcclxuICovXHJcbmZ1bmN0aW9uIG9yZGluYWwoaSkge1xyXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoaSkpIHtcclxuICAgICAgICByZXR1cm4gYCR7aX1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGkgKyBpbmRpY2F0b3IoaSk7XHJcbn1cclxuZnVuY3Rpb24gaW5kaWNhdG9yKGkpIHtcclxuICAgIGkgPSBNYXRoLmFicyhpKTtcclxuICAgIGNvbnN0IGNlbnQgPSBpICUgMTAwO1xyXG4gICAgaWYgKGNlbnQgPj0gMTAgJiYgY2VudCA8PSAyMCkge1xyXG4gICAgICAgIHJldHVybiAndGgnO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVjID0gaSAlIDEwO1xyXG4gICAgaWYgKGRlYyA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAnc3QnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYyA9PT0gMikge1xyXG4gICAgICAgIHJldHVybiAnbmQnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYyA9PT0gMykge1xyXG4gICAgICAgIHJldHVybiAncmQnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICd0aCc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0TW9kdWxhckluc3RhbmNlKHNlcnZpY2UpIHtcclxuICAgIGlmIChzZXJ2aWNlICYmIHNlcnZpY2UuX2RlbGVnYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuX2RlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgQ09OU1RBTlRTLCBEZWZlcnJlZCwgRXJyb3JGYWN0b3J5LCBGaXJlYmFzZUVycm9yLCBNQVhfVkFMVUVfTUlMTElTLCBSQU5ET01fRkFDVE9SLCBTaGExLCBhcmVDb29raWVzRW5hYmxlZCwgYXNzZXJ0LCBhc3NlcnRpb25FcnJvciwgYXN5bmMsIGJhc2U2NCwgYmFzZTY0RGVjb2RlLCBiYXNlNjRFbmNvZGUsIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nLCBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzLCBjb250YWlucywgY3JlYXRlTW9ja1VzZXJUb2tlbiwgY3JlYXRlU3Vic2NyaWJlLCBkZWNvZGUsIGRlZXBDb3B5LCBkZWVwRXF1YWwsIGRlZXBFeHRlbmQsIGVycm9yUHJlZml4LCBleHRyYWN0UXVlcnlzdHJpbmcsIGdldERlZmF1bHRBcHBDb25maWcsIGdldERlZmF1bHRFbXVsYXRvckhvc3QsIGdldERlZmF1bHRFbXVsYXRvckhvc3RuYW1lQW5kUG9ydCwgZ2V0RXhwZXJpbWVudGFsU2V0dGluZywgZ2V0R2xvYmFsLCBnZXRNb2R1bGFySW5zdGFuY2UsIGdldFVBLCBpc0FkbWluLCBpc0Jyb3dzZXIsIGlzQnJvd3NlckV4dGVuc2lvbiwgaXNFbGVjdHJvbiwgaXNFbXB0eSwgaXNJRSwgaXNJbmRleGVkREJBdmFpbGFibGUsIGlzTW9iaWxlQ29yZG92YSwgaXNOb2RlLCBpc05vZGVTZGssIGlzUmVhY3ROYXRpdmUsIGlzU2FmYXJpLCBpc1VXUCwgaXNWYWxpZEZvcm1hdCwgaXNWYWxpZFRpbWVzdGFtcCwgaXNzdWVkQXRUaW1lLCBqc29uRXZhbCwgbWFwLCBvcmRpbmFsLCBwcm9taXNlV2l0aFRpbWVvdXQsIHF1ZXJ5c3RyaW5nLCBxdWVyeXN0cmluZ0RlY29kZSwgc2FmZUdldCwgc3RyaW5nTGVuZ3RoLCBzdHJpbmdUb0J5dGVBcnJheSwgc3RyaW5naWZ5LCB1dWlkdjQsIHZhbGlkYXRlQXJnQ291bnQsIHZhbGlkYXRlQ2FsbGJhY2ssIHZhbGlkYXRlQ29udGV4dE9iamVjdCwgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSwgdmFsaWRhdGVOYW1lc3BhY2UgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJpbXBvcnQgeyBEZWZlcnJlZCB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcblxuLyoqXHJcbiAqIENvbXBvbmVudCBmb3Igc2VydmljZSBuYW1lIFQsIGUuZy4gYGF1dGhgLCBgYXV0aC1pbnRlcm5hbGBcclxuICovXHJcbmNsYXNzIENvbXBvbmVudCB7XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgcHVibGljIHNlcnZpY2UgbmFtZSwgZS5nLiBhcHAsIGF1dGgsIGZpcmVzdG9yZSwgZGF0YWJhc2VcclxuICAgICAqIEBwYXJhbSBpbnN0YW5jZUZhY3RvcnkgU2VydmljZSBmYWN0b3J5IHJlc3BvbnNpYmxlIGZvciBjcmVhdGluZyB0aGUgcHVibGljIGludGVyZmFjZVxyXG4gICAgICogQHBhcmFtIHR5cGUgd2hldGhlciB0aGUgc2VydmljZSBwcm92aWRlZCBieSB0aGUgY29tcG9uZW50IGlzIHB1YmxpYyBvciBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGluc3RhbmNlRmFjdG9yeSwgdHlwZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZUZhY3RvcnkgPSBpbnN0YW5jZUZhY3Rvcnk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcclxuICAgICAgICB0aGlzLm11bHRpcGxlSW5zdGFuY2VzID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvcGVydGllcyB0byBiZSBhZGRlZCB0byB0aGUgc2VydmljZSBuYW1lc3BhY2VcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnNlcnZpY2VQcm9wcyA9IHt9O1xyXG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbk1vZGUgPSBcIkxBWllcIiAvKiBMQVpZICovO1xyXG4gICAgICAgIHRoaXMub25JbnN0YW5jZUNyZWF0ZWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgc2V0SW5zdGFudGlhdGlvbk1vZGUobW9kZSkge1xyXG4gICAgICAgIHRoaXMuaW5zdGFudGlhdGlvbk1vZGUgPSBtb2RlO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0TXVsdGlwbGVJbnN0YW5jZXMobXVsdGlwbGVJbnN0YW5jZXMpIHtcclxuICAgICAgICB0aGlzLm11bHRpcGxlSW5zdGFuY2VzID0gbXVsdGlwbGVJbnN0YW5jZXM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRTZXJ2aWNlUHJvcHMocHJvcHMpIHtcclxuICAgICAgICB0aGlzLnNlcnZpY2VQcm9wcyA9IHByb3BzO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgc2V0SW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2soY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLm9uSW5zdGFuY2VDcmVhdGVkID0gY2FsbGJhY2s7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9FTlRSWV9OQU1FID0gJ1tERUZBVUxUXSc7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBQcm92aWRlciBmb3IgaW5zdGFuY2UgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuICdhdXRoJywgJ2F1dGgtaW50ZXJuYWwnXHJcbiAqIE5hbWVTZXJ2aWNlTWFwcGluZ1tUXSBpcyBhbiBhbGlhcyBmb3IgdGhlIHR5cGUgb2YgdGhlIGluc3RhbmNlXHJcbiAqL1xyXG5jbGFzcyBQcm92aWRlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmluc3RhbmNlcyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzT3B0aW9ucyA9IG5ldyBNYXAoKTtcclxuICAgICAgICB0aGlzLm9uSW5pdENhbGxiYWNrcyA9IG5ldyBNYXAoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgQSBwcm92aWRlciBjYW4gcHJvdmlkZSBtdWxpdHBsZSBpbnN0YW5jZXMgb2YgYSBzZXJ2aWNlXHJcbiAgICAgKiBpZiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyBpcyB0cnVlLlxyXG4gICAgICovXHJcbiAgICBnZXQoaWRlbnRpZmllcikge1xyXG4gICAgICAgIC8vIGlmIG11bHRpcGxlSW5zdGFuY2VzIGlzIG5vdCBzdXBwb3J0ZWQsIHVzZSB0aGUgZGVmYXVsdCBuYW1lXHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoIXRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuaGFzKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkLnNldChub3JtYWxpemVkSWRlbnRpZmllciwgZGVmZXJyZWQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSB8fFxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG91bGRBdXRvSW5pdGlhbGl6ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBzZXJ2aWNlIGlmIGl0IGNhbiBiZSBhdXRvLWluaXRpYWxpemVkXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgdGhyb3dzIGFuIGV4Y2VwdGlvbiBkdXJpbmcgZ2V0KCksIGl0IHNob3VsZCBub3QgY2F1c2VcclxuICAgICAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yLiBXZSBqdXN0IHJldHVybiB0aGUgdW5yZXNvbHZlZCBwcm9taXNlIGluIHRoaXMgY2FzZS5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpLnByb21pc2U7XHJcbiAgICB9XHJcbiAgICBnZXRJbW1lZGlhdGUob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICAvLyBpZiBtdWx0aXBsZUluc3RhbmNlcyBpcyBub3Qgc3VwcG9ydGVkLCB1c2UgdGhlIGRlZmF1bHQgbmFtZVxyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmlkZW50aWZpZXIpO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbmFsID0gKF9hID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLm9wdGlvbmFsKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBmYWxzZTtcclxuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSB8fFxyXG4gICAgICAgICAgICB0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9uYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIEluIGNhc2UgYSBjb21wb25lbnQgaXMgbm90IGluaXRpYWxpemVkIGFuZCBzaG91bGQvY2FuIG5vdCBiZSBhdXRvLWluaXRpYWxpemVkIGF0IHRoZSBtb21lbnQsIHJldHVybiBudWxsIGlmIHRoZSBvcHRpb25hbCBmbGFnIGlzIHNldCwgb3IgdGhyb3dcclxuICAgICAgICAgICAgaWYgKG9wdGlvbmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVycm9yKGBTZXJ2aWNlICR7dGhpcy5uYW1lfSBpcyBub3QgYXZhaWxhYmxlYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXRDb21wb25lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50O1xyXG4gICAgfVxyXG4gICAgc2V0Q29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGlmIChjb21wb25lbnQubmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBNaXNtYXRjaGluZyBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gZm9yIFByb3ZpZGVyICR7dGhpcy5uYW1lfS5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBDb21wb25lbnQgZm9yICR7dGhpcy5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIHByb3ZpZGVkYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50O1xyXG4gICAgICAgIC8vIHJldHVybiBlYXJseSB3aXRob3V0IGF0dGVtcHRpbmcgdG8gaW5pdGlhbGl6ZSB0aGUgY29tcG9uZW50IGlmIHRoZSBjb21wb25lbnQgcmVxdWlyZXMgZXhwbGljaXQgaW5pdGlhbGl6YXRpb24gKGNhbGxpbmcgYFByb3ZpZGVyLmluaXRpYWxpemUoKWApXHJcbiAgICAgICAgaWYgKCF0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBpZiB0aGUgc2VydmljZSBpcyBlYWdlciwgaW5pdGlhbGl6ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZVxyXG4gICAgICAgIGlmIChpc0NvbXBvbmVudEVhZ2VyKGNvbXBvbmVudCkpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7IGluc3RhbmNlSWRlbnRpZmllcjogREVGQVVMVF9FTlRSWV9OQU1FIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIHRoZSBpbnN0YW5jZSBmYWN0b3J5IGZvciBhbiBlYWdlciBDb21wb25lbnQgdGhyb3dzIGFuIGV4Y2VwdGlvbiBkdXJpbmcgdGhlIGVhZ2VyXHJcbiAgICAgICAgICAgICAgICAvLyBpbml0aWFsaXphdGlvbiwgaXQgc2hvdWxkIG5vdCBjYXVzZSBhIGZhdGFsIGVycm9yLlxyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogSW52ZXN0aWdhdGUgaWYgd2UgbmVlZCB0byBtYWtlIGl0IGNvbmZpZ3VyYWJsZSwgYmVjYXVzZSBzb21lIGNvbXBvbmVudCBtYXkgd2FudCB0byBjYXVzZVxyXG4gICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvciBpbiB0aGlzIGNhc2U/XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ3JlYXRlIHNlcnZpY2UgaW5zdGFuY2VzIGZvciB0aGUgcGVuZGluZyBwcm9taXNlcyBhbmQgcmVzb2x2ZSB0aGVtXHJcbiAgICAgICAgLy8gTk9URTogaWYgdGhpcy5tdWx0aXBsZUluc3RhbmNlcyBpcyBmYWxzZSwgb25seSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB3aWxsIGJlIGNyZWF0ZWRcclxuICAgICAgICAvLyBhbmQgYWxsIHByb21pc2VzIHdpdGggcmVzb2x2ZSB3aXRoIGl0IHJlZ2FyZGxlc3Mgb2YgdGhlIGlkZW50aWZpZXIuXHJcbiAgICAgICAgZm9yIChjb25zdCBbaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZURlZmVycmVkXSBvZiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmVudHJpZXMoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyBgZ2V0T3JJbml0aWFsaXplU2VydmljZSgpYCBzaG91bGQgYWx3YXlzIHJldHVybiBhIHZhbGlkIGluc3RhbmNlIHNpbmNlIGEgY29tcG9uZW50IGlzIGd1YXJhbnRlZWQuIHVzZSAhIHRvIG1ha2UgdHlwZXNjcmlwdCBoYXBweS5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgaXQgc2hvdWxkIG5vdCBjYXVzZVxyXG4gICAgICAgICAgICAgICAgLy8gYSBmYXRhbCBlcnJvci4gV2UganVzdCBsZWF2ZSB0aGUgcHJvbWlzZSB1bnJlc29sdmVkLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2xlYXJJbnN0YW5jZShpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5kZWxldGUoaWRlbnRpZmllcik7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zLmRlbGV0ZShpZGVudGlmaWVyKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlcy5kZWxldGUoaWRlbnRpZmllcik7XHJcbiAgICB9XHJcbiAgICAvLyBhcHAuZGVsZXRlKCkgd2lsbCBjYWxsIHRoaXMgbWV0aG9kIG9uIGV2ZXJ5IHByb3ZpZGVyIHRvIGRlbGV0ZSB0aGUgc2VydmljZXNcclxuICAgIC8vIFRPRE86IHNob3VsZCB3ZSBtYXJrIHRoZSBwcm92aWRlciBhcyBkZWxldGVkP1xyXG4gICAgYXN5bmMgZGVsZXRlKCkge1xyXG4gICAgICAgIGNvbnN0IHNlcnZpY2VzID0gQXJyYXkuZnJvbSh0aGlzLmluc3RhbmNlcy52YWx1ZXMoKSk7XHJcbiAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgICAgICAuLi5zZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihzZXJ2aWNlID0+ICdJTlRFUk5BTCcgaW4gc2VydmljZSkgLy8gbGVnYWN5IHNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgLm1hcChzZXJ2aWNlID0+IHNlcnZpY2UuSU5URVJOQUwuZGVsZXRlKCkpLFxyXG4gICAgICAgICAgICAuLi5zZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLmZpbHRlcihzZXJ2aWNlID0+ICdfZGVsZXRlJyBpbiBzZXJ2aWNlKSAvLyBtb2R1bGFyaXplZCBzZXJ2aWNlc1xyXG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgICAgIC5tYXAoc2VydmljZSA9PiBzZXJ2aWNlLl9kZWxldGUoKSlcclxuICAgICAgICBdKTtcclxuICAgIH1cclxuICAgIGlzQ29tcG9uZW50U2V0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudCAhPSBudWxsO1xyXG4gICAgfVxyXG4gICAgaXNJbml0aWFsaXplZChpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzLmhhcyhpZGVudGlmaWVyKTtcclxuICAgIH1cclxuICAgIGdldE9wdGlvbnMoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc09wdGlvbnMuZ2V0KGlkZW50aWZpZXIpIHx8IHt9O1xyXG4gICAgfVxyXG4gICAgaW5pdGlhbGl6ZShvcHRzID0ge30pIHtcclxuICAgICAgICBjb25zdCB7IG9wdGlvbnMgPSB7fSB9ID0gb3B0cztcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKG9wdHMuaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgJHt0aGlzLm5hbWV9KCR7bm9ybWFsaXplZElkZW50aWZpZXJ9KSBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBDb21wb25lbnQgJHt0aGlzLm5hbWV9IGhhcyBub3QgYmVlbiByZWdpc3RlcmVkIHlldGApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXIsXHJcbiAgICAgICAgICAgIG9wdGlvbnNcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyByZXNvbHZlIGFueSBwZW5kaW5nIHByb21pc2Ugd2FpdGluZyBmb3IgdGhlIHNlcnZpY2UgaW5zdGFuY2VcclxuICAgICAgICBmb3IgKGNvbnN0IFtpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlRGVmZXJyZWRdIG9mIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWREZWZlcnJlZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICBpZiAobm9ybWFsaXplZElkZW50aWZpZXIgPT09IG5vcm1hbGl6ZWREZWZlcnJlZElkZW50aWZpZXIpIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlRGVmZXJyZWQucmVzb2x2ZShpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIC0gYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgaW52b2tlZCAgYWZ0ZXIgdGhlIHByb3ZpZGVyIGhhcyBiZWVuIGluaXRpYWxpemVkIGJ5IGNhbGxpbmcgcHJvdmlkZXIuaW5pdGlhbGl6ZSgpLlxyXG4gICAgICogVGhlIGZ1bmN0aW9uIGlzIGludm9rZWQgU1lOQ0hST05PVVNMWSwgc28gaXQgc2hvdWxkIG5vdCBleGVjdXRlIGFueSBsb25ncnVubmluZyB0YXNrcyBpbiBvcmRlciB0byBub3QgYmxvY2sgdGhlIHByb2dyYW0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkZW50aWZpZXIgQW4gb3B0aW9uYWwgaW5zdGFuY2UgaWRlbnRpZmllclxyXG4gICAgICogQHJldHVybnMgYSBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyIHRoZSBjYWxsYmFja1xyXG4gICAgICovXHJcbiAgICBvbkluaXQoY2FsbGJhY2ssIGlkZW50aWZpZXIpIHtcclxuICAgICAgICB2YXIgX2E7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyKTtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0NhbGxiYWNrcyA9IChfYSA9IHRoaXMub25Jbml0Q2FsbGJhY2tzLmdldChub3JtYWxpemVkSWRlbnRpZmllcikpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IG5ldyBTZXQoKTtcclxuICAgICAgICBleGlzdGluZ0NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMub25Jbml0Q2FsbGJhY2tzLnNldChub3JtYWxpemVkSWRlbnRpZmllciwgZXhpc3RpbmdDYWxsYmFja3MpO1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlcy5nZXQobm9ybWFsaXplZElkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmIChleGlzdGluZ0luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGV4aXN0aW5nSW5zdGFuY2UsIG5vcm1hbGl6ZWRJZGVudGlmaWVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAgICAgZXhpc3RpbmdDYWxsYmFja3MuZGVsZXRlKGNhbGxiYWNrKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnZva2Ugb25Jbml0IGNhbGxiYWNrcyBzeW5jaHJvbm91c2x5XHJcbiAgICAgKiBAcGFyYW0gaW5zdGFuY2UgdGhlIHNlcnZpY2UgaW5zdGFuY2VgXHJcbiAgICAgKi9cclxuICAgIGludm9rZU9uSW5pdENhbGxiYWNrcyhpbnN0YW5jZSwgaWRlbnRpZmllcikge1xyXG4gICAgICAgIGNvbnN0IGNhbGxiYWNrcyA9IHRoaXMub25Jbml0Q2FsbGJhY2tzLmdldChpZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhpbnN0YW5jZSwgaWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluaXQgY2FsbGJhY2tcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldE9ySW5pdGlhbGl6ZVNlcnZpY2UoeyBpbnN0YW5jZUlkZW50aWZpZXIsIG9wdGlvbnMgPSB7fSB9KSB7XHJcbiAgICAgICAgbGV0IGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXMuZ2V0KGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKCFpbnN0YW5jZSAmJiB0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICBpbnN0YW5jZSA9IHRoaXMuY29tcG9uZW50Lmluc3RhbmNlRmFjdG9yeSh0aGlzLmNvbnRhaW5lciwge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVJZGVudGlmaWVyRm9yRmFjdG9yeShpbnN0YW5jZUlkZW50aWZpZXIpLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9uc1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5pbnN0YW5jZXMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbnZva2Ugb25Jbml0IGxpc3RlbmVycy5cclxuICAgICAgICAgICAgICogTm90ZSB0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCBpcyBkaWZmZXJlbnQsIHdoaWNoIGlzIHVzZWQgYnkgdGhlIGNvbXBvbmVudCBjcmVhdG9yLFxyXG4gICAgICAgICAgICAgKiB3aGlsZSBvbkluaXQgbGlzdGVuZXJzIGFyZSByZWdpc3RlcmVkIGJ5IGNvbnN1bWVycyBvZiB0aGUgcHJvdmlkZXIuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLmludm9rZU9uSW5pdENhbGxiYWNrcyhpbnN0YW5jZSwgaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIE9yZGVyIGlzIGltcG9ydGFudFxyXG4gICAgICAgICAgICAgKiBvbkluc3RhbmNlQ3JlYXRlZCgpIHNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgdGhpcy5pbnN0YW5jZXMuc2V0KGluc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2UpOyB3aGljaFxyXG4gICAgICAgICAgICAgKiBtYWtlcyBgaXNJbml0aWFsaXplZCgpYCByZXR1cm4gdHJ1ZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5vbkluc3RhbmNlQ3JlYXRlZCh0aGlzLmNvbnRhaW5lciwgaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoX2EpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgZXJyb3JzIGluIHRoZSBvbkluc3RhbmNlQ3JlYXRlZENhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlIHx8IG51bGw7XHJcbiAgICB9XHJcbiAgICBub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQubXVsdGlwbGVJbnN0YW5jZXMgPyBpZGVudGlmaWVyIDogREVGQVVMVF9FTlRSWV9OQU1FO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkZW50aWZpZXI7IC8vIGFzc3VtZSBtdWx0aXBsZSBpbnN0YW5jZXMgYXJlIHN1cHBvcnRlZCBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyBwcm92aWRlZC5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzaG91bGRBdXRvSW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICByZXR1cm4gKCEhdGhpcy5jb21wb25lbnQgJiZcclxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgIT09IFwiRVhQTElDSVRcIiAvKiBFWFBMSUNJVCAqLyk7XHJcbiAgICB9XHJcbn1cclxuLy8gdW5kZWZpbmVkIHNob3VsZCBiZSBwYXNzZWQgdG8gdGhlIHNlcnZpY2UgZmFjdG9yeSBmb3IgdGhlIGRlZmF1bHQgaW5zdGFuY2VcclxuZnVuY3Rpb24gbm9ybWFsaXplSWRlbnRpZmllckZvckZhY3RvcnkoaWRlbnRpZmllcikge1xyXG4gICAgcmV0dXJuIGlkZW50aWZpZXIgPT09IERFRkFVTFRfRU5UUllfTkFNRSA/IHVuZGVmaW5lZCA6IGlkZW50aWZpZXI7XHJcbn1cclxuZnVuY3Rpb24gaXNDb21wb25lbnRFYWdlcihjb21wb25lbnQpIHtcclxuICAgIHJldHVybiBjb21wb25lbnQuaW5zdGFudGlhdGlvbk1vZGUgPT09IFwiRUFHRVJcIiAvKiBFQUdFUiAqLztcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQ29tcG9uZW50Q29udGFpbmVyIHRoYXQgcHJvdmlkZXMgUHJvdmlkZXJzIGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxyXG4gKi9cclxuY2xhc3MgQ29tcG9uZW50Q29udGFpbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvbXBvbmVudCBDb21wb25lbnQgYmVpbmcgYWRkZWRcclxuICAgICAqIEBwYXJhbSBvdmVyd3JpdGUgV2hlbiBhIGNvbXBvbmVudCB3aXRoIHRoZSBzYW1lIG5hbWUgaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkLFxyXG4gICAgICogaWYgb3ZlcndyaXRlIGlzIHRydWU6IG92ZXJ3cml0ZSB0aGUgZXhpc3RpbmcgY29tcG9uZW50IHdpdGggdGhlIG5ldyBjb21wb25lbnQgYW5kIGNyZWF0ZSBhIG5ld1xyXG4gICAgICogcHJvdmlkZXIgd2l0aCB0aGUgbmV3IGNvbXBvbmVudC4gSXQgY2FuIGJlIHVzZWZ1bCBpbiB0ZXN0cyB3aGVyZSB5b3Ugd2FudCB0byB1c2UgZGlmZmVyZW50IG1vY2tzXHJcbiAgICAgKiBmb3IgZGlmZmVyZW50IHRlc3RzLlxyXG4gICAgICogaWYgb3ZlcndyaXRlIGlzIGZhbHNlOiB0aHJvdyBhbiBleGNlcHRpb25cclxuICAgICAqL1xyXG4gICAgYWRkQ29tcG9uZW50KGNvbXBvbmVudCkge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5nZXRQcm92aWRlcihjb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgaWYgKHByb3ZpZGVyLmlzQ29tcG9uZW50U2V0KCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gaGFzIGFscmVhZHkgYmVlbiByZWdpc3RlcmVkIHdpdGggJHt0aGlzLm5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3ZpZGVyLnNldENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICBpZiAocHJvdmlkZXIuaXNDb21wb25lbnRTZXQoKSkge1xyXG4gICAgICAgICAgICAvLyBkZWxldGUgdGhlIGV4aXN0aW5nIHByb3ZpZGVyIGZyb20gdGhlIGNvbnRhaW5lciwgc28gd2UgY2FuIHJlZ2lzdGVyIHRoZSBuZXcgY29tcG9uZW50XHJcbiAgICAgICAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShjb21wb25lbnQubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldFByb3ZpZGVyIHByb3ZpZGVzIGEgdHlwZSBzYWZlIGludGVyZmFjZSB3aGVyZSBpdCBjYW4gb25seSBiZSBjYWxsZWQgd2l0aCBhIGZpZWxkIG5hbWVcclxuICAgICAqIHByZXNlbnQgaW4gTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZS5cclxuICAgICAqXHJcbiAgICAgKiBGaXJlYmFzZSBTREtzIHByb3ZpZGluZyBzZXJ2aWNlcyBzaG91bGQgZXh0ZW5kIE5hbWVTZXJ2aWNlTWFwcGluZyBpbnRlcmZhY2UgdG8gcmVnaXN0ZXJcclxuICAgICAqIHRoZW1zZWx2ZXMuXHJcbiAgICAgKi9cclxuICAgIGdldFByb3ZpZGVyKG5hbWUpIHtcclxuICAgICAgICBpZiAodGhpcy5wcm92aWRlcnMuaGFzKG5hbWUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5nZXQobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNyZWF0ZSBhIFByb3ZpZGVyIGZvciBhIHNlcnZpY2UgdGhhdCBoYXNuJ3QgcmVnaXN0ZXJlZCB3aXRoIEZpcmViYXNlXHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgUHJvdmlkZXIobmFtZSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlcnMuc2V0KG5hbWUsIHByb3ZpZGVyKTtcclxuICAgICAgICByZXR1cm4gcHJvdmlkZXI7XHJcbiAgICB9XHJcbiAgICBnZXRQcm92aWRlcnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5wcm92aWRlcnMudmFsdWVzKCkpO1xyXG4gICAgfVxyXG59XG5cbmV4cG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q29udGFpbmVyLCBQcm92aWRlciB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsIi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBIGNvbnRhaW5lciBmb3IgYWxsIG9mIHRoZSBMb2dnZXIgaW5zdGFuY2VzXHJcbiAqL1xyXG5jb25zdCBpbnN0YW5jZXMgPSBbXTtcclxuLyoqXHJcbiAqIFRoZSBKUyBTREsgc3VwcG9ydHMgNSBsb2cgbGV2ZWxzIGFuZCBhbHNvIGFsbG93cyBhIHVzZXIgdGhlIGFiaWxpdHkgdG9cclxuICogc2lsZW5jZSB0aGUgbG9ncyBhbHRvZ2V0aGVyLlxyXG4gKlxyXG4gKiBUaGUgb3JkZXIgaXMgYSBmb2xsb3dzOlxyXG4gKiBERUJVRyA8IFZFUkJPU0UgPCBJTkZPIDwgV0FSTiA8IEVSUk9SXHJcbiAqXHJcbiAqIEFsbCBvZiB0aGUgbG9nIHR5cGVzIGFib3ZlIHRoZSBjdXJyZW50IGxvZyBsZXZlbCB3aWxsIGJlIGNhcHR1cmVkIChpLmUuIGlmXHJcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgSU5GT2AsIGVycm9ycyB3aWxsIHN0aWxsIGJlIGxvZ2dlZCwgYnV0IGBERUJVR2AgYW5kXHJcbiAqIGBWRVJCT1NFYCBsb2dzIHdpbGwgbm90KVxyXG4gKi9cclxudmFyIExvZ0xldmVsO1xyXG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkRFQlVHXCJdID0gMF0gPSBcIkRFQlVHXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIlZFUkJPU0VcIl0gPSAxXSA9IFwiVkVSQk9TRVwiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJJTkZPXCJdID0gMl0gPSBcIklORk9cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiV0FSTlwiXSA9IDNdID0gXCJXQVJOXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIkVSUk9SXCJdID0gNF0gPSBcIkVSUk9SXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIlNJTEVOVFwiXSA9IDVdID0gXCJTSUxFTlRcIjtcclxufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcclxuY29uc3QgbGV2ZWxTdHJpbmdUb0VudW0gPSB7XHJcbiAgICAnZGVidWcnOiBMb2dMZXZlbC5ERUJVRyxcclxuICAgICd2ZXJib3NlJzogTG9nTGV2ZWwuVkVSQk9TRSxcclxuICAgICdpbmZvJzogTG9nTGV2ZWwuSU5GTyxcclxuICAgICd3YXJuJzogTG9nTGV2ZWwuV0FSTixcclxuICAgICdlcnJvcic6IExvZ0xldmVsLkVSUk9SLFxyXG4gICAgJ3NpbGVudCc6IExvZ0xldmVsLlNJTEVOVFxyXG59O1xyXG4vKipcclxuICogVGhlIGRlZmF1bHQgbG9nIGxldmVsXHJcbiAqL1xyXG5jb25zdCBkZWZhdWx0TG9nTGV2ZWwgPSBMb2dMZXZlbC5JTkZPO1xyXG4vKipcclxuICogQnkgZGVmYXVsdCwgYGNvbnNvbGUuZGVidWdgIGlzIG5vdCBkaXNwbGF5ZWQgaW4gdGhlIGRldmVsb3BlciBjb25zb2xlIChpblxyXG4gKiBjaHJvbWUpLiBUbyBhdm9pZCBmb3JjaW5nIHVzZXJzIHRvIGhhdmUgdG8gb3B0LWluIHRvIHRoZXNlIGxvZ3MgdHdpY2VcclxuICogKGkuZS4gb25jZSBmb3IgZmlyZWJhc2UsIGFuZCBvbmNlIGluIHRoZSBjb25zb2xlKSwgd2UgYXJlIHNlbmRpbmcgYERFQlVHYFxyXG4gKiBsb2dzIHRvIHRoZSBgY29uc29sZS5sb2dgIGZ1bmN0aW9uLlxyXG4gKi9cclxuY29uc3QgQ29uc29sZU1ldGhvZCA9IHtcclxuICAgIFtMb2dMZXZlbC5ERUJVR106ICdsb2cnLFxyXG4gICAgW0xvZ0xldmVsLlZFUkJPU0VdOiAnbG9nJyxcclxuICAgIFtMb2dMZXZlbC5JTkZPXTogJ2luZm8nLFxyXG4gICAgW0xvZ0xldmVsLldBUk5dOiAnd2FybicsXHJcbiAgICBbTG9nTGV2ZWwuRVJST1JdOiAnZXJyb3InXHJcbn07XHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBsb2cgaGFuZGxlciB3aWxsIGZvcndhcmQgREVCVUcsIFZFUkJPU0UsIElORk8sIFdBUk4sIGFuZCBFUlJPUlxyXG4gKiBtZXNzYWdlcyBvbiB0byB0aGVpciBjb3JyZXNwb25kaW5nIGNvbnNvbGUgY291bnRlcnBhcnRzIChpZiB0aGUgbG9nIG1ldGhvZFxyXG4gKiBpcyBzdXBwb3J0ZWQgYnkgdGhlIGN1cnJlbnQgbG9nIGxldmVsKVxyXG4gKi9cclxuY29uc3QgZGVmYXVsdExvZ0hhbmRsZXIgPSAoaW5zdGFuY2UsIGxvZ1R5cGUsIC4uLmFyZ3MpID0+IHtcclxuICAgIGlmIChsb2dUeXBlIDwgaW5zdGFuY2UubG9nTGV2ZWwpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XHJcbiAgICBjb25zdCBtZXRob2QgPSBDb25zb2xlTWV0aG9kW2xvZ1R5cGVdO1xyXG4gICAgaWYgKG1ldGhvZCkge1xyXG4gICAgICAgIGNvbnNvbGVbbWV0aG9kXShgWyR7bm93fV0gICR7aW5zdGFuY2UubmFtZX06YCwgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEF0dGVtcHRlZCB0byBsb2cgYSBtZXNzYWdlIHdpdGggYW4gaW52YWxpZCBsb2dUeXBlICh2YWx1ZTogJHtsb2dUeXBlfSlgKTtcclxuICAgIH1cclxufTtcclxuY2xhc3MgTG9nZ2VyIHtcclxuICAgIC8qKlxyXG4gICAgICogR2l2ZXMgeW91IGFuIGluc3RhbmNlIG9mIGEgTG9nZ2VyIHRvIGNhcHR1cmUgbWVzc2FnZXMgYWNjb3JkaW5nIHRvXHJcbiAgICAgKiBGaXJlYmFzZSdzIGxvZ2dpbmcgc2NoZW1lLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRoYXQgdGhlIGxvZ3Mgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGhcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIGxvZyBsZXZlbCBvZiB0aGUgZ2l2ZW4gTG9nZ2VyIGluc3RhbmNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gZGVmYXVsdExvZ0xldmVsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBtYWluIChpbnRlcm5hbCkgbG9nIGhhbmRsZXIgZm9yIHRoZSBMb2dnZXIgaW5zdGFuY2UuXHJcbiAgICAgICAgICogQ2FuIGJlIHNldCB0byBhIG5ldyBmdW5jdGlvbiBpbiBpbnRlcm5hbCBwYWNrYWdlIGNvZGUgYnV0IG5vdCBieSB1c2VyLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIgPSBkZWZhdWx0TG9nSGFuZGxlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgb3B0aW9uYWwsIGFkZGl0aW9uYWwsIHVzZXItZGVmaW5lZCBsb2cgaGFuZGxlciBmb3IgdGhlIExvZ2dlciBpbnN0YW5jZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2FwdHVyZSB0aGUgY3VycmVudCBpbnN0YW5jZSBmb3IgbGF0ZXIgdXNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaW5zdGFuY2VzLnB1c2godGhpcyk7XHJcbiAgICB9XHJcbiAgICBnZXQgbG9nTGV2ZWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0xldmVsO1xyXG4gICAgfVxyXG4gICAgc2V0IGxvZ0xldmVsKHZhbCkge1xyXG4gICAgICAgIGlmICghKHZhbCBpbiBMb2dMZXZlbCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCB2YWx1ZSBcIiR7dmFsfVwiIGFzc2lnbmVkIHRvIFxcYGxvZ0xldmVsXFxgYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLy8gV29ya2Fyb3VuZCBmb3Igc2V0dGVyL2dldHRlciBoYXZpbmcgdG8gYmUgdGhlIHNhbWUgdHlwZS5cclxuICAgIHNldExvZ0xldmVsKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ0xldmVsID0gdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycgPyBsZXZlbFN0cmluZ1RvRW51bVt2YWxdIDogdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IGxvZ0hhbmRsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZ0hhbmRsZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgbG9nSGFuZGxlcih2YWwpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdWYWx1ZSBhc3NpZ25lZCB0byBgbG9nSGFuZGxlcmAgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIgPSB2YWw7XHJcbiAgICB9XHJcbiAgICBnZXQgdXNlckxvZ0hhbmRsZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VzZXJMb2dIYW5kbGVyO1xyXG4gICAgfVxyXG4gICAgc2V0IHVzZXJMb2dIYW5kbGVyKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZnVuY3Rpb25zIGJlbG93IGFyZSBhbGwgYmFzZWQgb24gdGhlIGBjb25zb2xlYCBpbnRlcmZhY2VcclxuICAgICAqL1xyXG4gICAgZGVidWcoLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkRFQlVHLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkRFQlVHLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGxvZyguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiZcclxuICAgICAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuVkVSQk9TRSwgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5WRVJCT1NFLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGluZm8oLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLklORk8sIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICB3YXJuKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJiB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5XQVJOLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgZXJyb3IoLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLkVSUk9SLCAuLi5hcmdzKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBzZXRMb2dMZXZlbChsZXZlbCkge1xyXG4gICAgaW5zdGFuY2VzLmZvckVhY2goaW5zdCA9PiB7XHJcbiAgICAgICAgaW5zdC5zZXRMb2dMZXZlbChsZXZlbCk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBzZXRVc2VyTG9nSGFuZGxlcihsb2dDYWxsYmFjaywgb3B0aW9ucykge1xyXG4gICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcclxuICAgICAgICBsZXQgY3VzdG9tTG9nTGV2ZWwgPSBudWxsO1xyXG4gICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGV2ZWwpIHtcclxuICAgICAgICAgICAgY3VzdG9tTG9nTGV2ZWwgPSBsZXZlbFN0cmluZ1RvRW51bVtvcHRpb25zLmxldmVsXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGxvZ0NhbGxiYWNrID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLnVzZXJMb2dIYW5kbGVyID0gKGluc3RhbmNlLCBsZXZlbCwgLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGFyZ3NcclxuICAgICAgICAgICAgICAgICAgICAubWFwKGFyZyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFyZyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fCB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFyZy50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChhcmcgaW5zdGFuY2VvZiBFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGlnbm9yZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGFyZyA9PiBhcmcpXHJcbiAgICAgICAgICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgICAgICAgICAgICAgIGlmIChsZXZlbCA+PSAoY3VzdG9tTG9nTGV2ZWwgIT09IG51bGwgJiYgY3VzdG9tTG9nTGV2ZWwgIT09IHZvaWQgMCA/IGN1c3RvbUxvZ0xldmVsIDogaW5zdGFuY2UubG9nTGV2ZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9nQ2FsbGJhY2soe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXZlbDogTG9nTGV2ZWxbbGV2ZWxdLnRvTG93ZXJDYXNlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGluc3RhbmNlLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgTG9nTGV2ZWwsIExvZ2dlciwgc2V0TG9nTGV2ZWwsIHNldFVzZXJMb2dIYW5kbGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiY29uc3QgaW5zdGFuY2VPZkFueSA9IChvYmplY3QsIGNvbnN0cnVjdG9ycykgPT4gY29uc3RydWN0b3JzLnNvbWUoKGMpID0+IG9iamVjdCBpbnN0YW5jZW9mIGMpO1xuXG5sZXQgaWRiUHJveHlhYmxlVHlwZXM7XG5sZXQgY3Vyc29yQWR2YW5jZU1ldGhvZHM7XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldElkYlByb3h5YWJsZVR5cGVzKCkge1xuICAgIHJldHVybiAoaWRiUHJveHlhYmxlVHlwZXMgfHxcbiAgICAgICAgKGlkYlByb3h5YWJsZVR5cGVzID0gW1xuICAgICAgICAgICAgSURCRGF0YWJhc2UsXG4gICAgICAgICAgICBJREJPYmplY3RTdG9yZSxcbiAgICAgICAgICAgIElEQkluZGV4LFxuICAgICAgICAgICAgSURCQ3Vyc29yLFxuICAgICAgICAgICAgSURCVHJhbnNhY3Rpb24sXG4gICAgICAgIF0pKTtcbn1cbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKSB7XG4gICAgcmV0dXJuIChjdXJzb3JBZHZhbmNlTWV0aG9kcyB8fFxuICAgICAgICAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgPSBbXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmFkdmFuY2UsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZVByaW1hcnlLZXksXG4gICAgICAgIF0pKTtcbn1cbmNvbnN0IGN1cnNvclJlcXVlc3RNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25Eb25lTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKHdyYXAocmVxdWVzdC5yZXN1bHQpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgfSk7XG4gICAgcHJvbWlzZVxuICAgICAgICAudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgLy8gU2luY2UgY3Vyc29yaW5nIHJldXNlcyB0aGUgSURCUmVxdWVzdCAoKnNpZ2gqKSwgd2UgY2FjaGUgaXQgZm9yIGxhdGVyIHJldHJpZXZhbFxuICAgICAgICAvLyAoc2VlIHdyYXBGdW5jdGlvbikuXG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQkN1cnNvcikge1xuICAgICAgICAgICAgY3Vyc29yUmVxdWVzdE1hcC5zZXQodmFsdWUsIHJlcXVlc3QpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhdGNoaW5nIHRvIGF2b2lkIFwiVW5jYXVnaHQgUHJvbWlzZSBleGNlcHRpb25zXCJcbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICAvLyBUaGlzIG1hcHBpbmcgZXhpc3RzIGluIHJldmVyc2VUcmFuc2Zvcm1DYWNoZSBidXQgZG9lc24ndCBkb2Vzbid0IGV4aXN0IGluIHRyYW5zZm9ybUNhY2hlLiBUaGlzXG4gICAgLy8gaXMgYmVjYXVzZSB3ZSBjcmVhdGUgbWFueSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QuXG4gICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChwcm9taXNlLCByZXF1ZXN0KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cbmZ1bmN0aW9uIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih0eCkge1xuICAgIC8vIEVhcmx5IGJhaWwgaWYgd2UndmUgYWxyZWFkeSBjcmVhdGVkIGEgZG9uZSBwcm9taXNlIGZvciB0aGlzIHRyYW5zYWN0aW9uLlxuICAgIGlmICh0cmFuc2FjdGlvbkRvbmVNYXAuaGFzKHR4KSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGRvbmUgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGVycm9yID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KHR4LmVycm9yIHx8IG5ldyBET01FeGNlcHRpb24oJ0Fib3J0RXJyb3InLCAnQWJvcnRFcnJvcicpKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgY29tcGxldGUpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgfSk7XG4gICAgLy8gQ2FjaGUgaXQgZm9yIGxhdGVyIHJldHJpZXZhbC5cbiAgICB0cmFuc2FjdGlvbkRvbmVNYXAuc2V0KHR4LCBkb25lKTtcbn1cbmxldCBpZGJQcm94eVRyYXBzID0ge1xuICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbikge1xuICAgICAgICAgICAgLy8gU3BlY2lhbCBoYW5kbGluZyBmb3IgdHJhbnNhY3Rpb24uZG9uZS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnZG9uZScpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uRG9uZU1hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIC8vIFBvbHlmaWxsIGZvciBvYmplY3RTdG9yZU5hbWVzIGJlY2F1c2Ugb2YgRWRnZS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnb2JqZWN0U3RvcmVOYW1lcycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0Lm9iamVjdFN0b3JlTmFtZXMgfHwgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gTWFrZSB0eC5zdG9yZSByZXR1cm4gdGhlIG9ubHkgc3RvcmUgaW4gdGhlIHRyYW5zYWN0aW9uLCBvciB1bmRlZmluZWQgaWYgdGhlcmUgYXJlIG1hbnkuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ3N0b3JlJykge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzFdXG4gICAgICAgICAgICAgICAgICAgID8gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIDogcmVjZWl2ZXIub2JqZWN0U3RvcmUocmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1swXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWxzZSB0cmFuc2Zvcm0gd2hhdGV2ZXIgd2UgZ2V0IGJhY2suXG4gICAgICAgIHJldHVybiB3cmFwKHRhcmdldFtwcm9wXSk7XG4gICAgfSxcbiAgICBzZXQodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBoYXModGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbiAmJlxuICAgICAgICAgICAgKHByb3AgPT09ICdkb25lJyB8fCBwcm9wID09PSAnc3RvcmUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByb3AgaW4gdGFyZ2V0O1xuICAgIH0sXG59O1xuZnVuY3Rpb24gcmVwbGFjZVRyYXBzKGNhbGxiYWNrKSB7XG4gICAgaWRiUHJveHlUcmFwcyA9IGNhbGxiYWNrKGlkYlByb3h5VHJhcHMpO1xufVxuZnVuY3Rpb24gd3JhcEZ1bmN0aW9uKGZ1bmMpIHtcbiAgICAvLyBEdWUgdG8gZXhwZWN0ZWQgb2JqZWN0IGVxdWFsaXR5ICh3aGljaCBpcyBlbmZvcmNlZCBieSB0aGUgY2FjaGluZyBpbiBgd3JhcGApLCB3ZVxuICAgIC8vIG9ubHkgY3JlYXRlIG9uZSBuZXcgZnVuYyBwZXIgZnVuYy5cbiAgICAvLyBFZGdlIGRvZXNuJ3Qgc3VwcG9ydCBvYmplY3RTdG9yZU5hbWVzIChib29vKSwgc28gd2UgcG9seWZpbGwgaXQgaGVyZS5cbiAgICBpZiAoZnVuYyA9PT0gSURCRGF0YWJhc2UucHJvdG90eXBlLnRyYW5zYWN0aW9uICYmXG4gICAgICAgICEoJ29iamVjdFN0b3JlTmFtZXMnIGluIElEQlRyYW5zYWN0aW9uLnByb3RvdHlwZSkpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzdG9yZU5hbWVzLCAuLi5hcmdzKSB7XG4gICAgICAgICAgICBjb25zdCB0eCA9IGZ1bmMuY2FsbCh1bndyYXAodGhpcyksIHN0b3JlTmFtZXMsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwLnNldCh0eCwgc3RvcmVOYW1lcy5zb3J0ID8gc3RvcmVOYW1lcy5zb3J0KCkgOiBbc3RvcmVOYW1lc10pO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAodHgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBDdXJzb3IgbWV0aG9kcyBhcmUgc3BlY2lhbCwgYXMgdGhlIGJlaGF2aW91ciBpcyBhIGxpdHRsZSBtb3JlIGRpZmZlcmVudCB0byBzdGFuZGFyZCBJREIuIEluXG4gICAgLy8gSURCLCB5b3UgYWR2YW5jZSB0aGUgY3Vyc29yIGFuZCB3YWl0IGZvciBhIG5ldyAnc3VjY2Vzcycgb24gdGhlIElEQlJlcXVlc3QgdGhhdCBnYXZlIHlvdSB0aGVcbiAgICAvLyBjdXJzb3IuIEl0J3Mga2luZGEgbGlrZSBhIHByb21pc2UgdGhhdCBjYW4gcmVzb2x2ZSB3aXRoIG1hbnkgdmFsdWVzLiBUaGF0IGRvZXNuJ3QgbWFrZSBzZW5zZVxuICAgIC8vIHdpdGggcmVhbCBwcm9taXNlcywgc28gZWFjaCBhZHZhbmNlIG1ldGhvZHMgcmV0dXJucyBhIG5ldyBwcm9taXNlIGZvciB0aGUgY3Vyc29yIG9iamVjdCwgb3JcbiAgICAvLyB1bmRlZmluZWQgaWYgdGhlIGVuZCBvZiB0aGUgY3Vyc29yIGhhcyBiZWVuIHJlYWNoZWQuXG4gICAgaWYgKGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkuaW5jbHVkZXMoZnVuYykpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgICAgICAgZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpO1xuICAgICAgICAgICAgcmV0dXJuIHdyYXAoY3Vyc29yUmVxdWVzdE1hcC5nZXQodGhpcykpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gQ2FsbGluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJveHkgYXMgJ3RoaXMnIGNhdXNlcyBJTExFR0FMIElOVk9DQVRJT04sIHNvIHdlIHVzZVxuICAgICAgICAvLyB0aGUgb3JpZ2luYWwgb2JqZWN0LlxuICAgICAgICByZXR1cm4gd3JhcChmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncykpO1xuICAgIH07XG59XG5mdW5jdGlvbiB0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgcmV0dXJuIHdyYXBGdW5jdGlvbih2YWx1ZSk7XG4gICAgLy8gVGhpcyBkb2Vzbid0IHJldHVybiwgaXQganVzdCBjcmVhdGVzIGEgJ2RvbmUnIHByb21pc2UgZm9yIHRoZSB0cmFuc2FjdGlvbixcbiAgICAvLyB3aGljaCBpcyBsYXRlciByZXR1cm5lZCBmb3IgdHJhbnNhY3Rpb24uZG9uZSAoc2VlIGlkYk9iamVjdEhhbmRsZXIpLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKVxuICAgICAgICBjYWNoZURvbmVQcm9taXNlRm9yVHJhbnNhY3Rpb24odmFsdWUpO1xuICAgIGlmIChpbnN0YW5jZU9mQW55KHZhbHVlLCBnZXRJZGJQcm94eWFibGVUeXBlcygpKSlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh2YWx1ZSwgaWRiUHJveHlUcmFwcyk7XG4gICAgLy8gUmV0dXJuIHRoZSBzYW1lIHZhbHVlIGJhY2sgaWYgd2UncmUgbm90IGdvaW5nIHRvIHRyYW5zZm9ybSBpdC5cbiAgICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiB3cmFwKHZhbHVlKSB7XG4gICAgLy8gV2Ugc29tZXRpbWVzIGdlbmVyYXRlIG11bHRpcGxlIHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdCAoZWcgd2hlbiBjdXJzb3JpbmcpLCBiZWNhdXNlXG4gICAgLy8gSURCIGlzIHdlaXJkIGFuZCBhIHNpbmdsZSBJREJSZXF1ZXN0IGNhbiB5aWVsZCBtYW55IHJlc3BvbnNlcywgc28gdGhlc2UgY2FuJ3QgYmUgY2FjaGVkLlxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElEQlJlcXVlc3QpXG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0KHZhbHVlKTtcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IHRyYW5zZm9ybWVkIHRoaXMgdmFsdWUgYmVmb3JlLCByZXVzZSB0aGUgdHJhbnNmb3JtZWQgdmFsdWUuXG4gICAgLy8gVGhpcyBpcyBmYXN0ZXIsIGJ1dCBpdCBhbHNvIHByb3ZpZGVzIG9iamVjdCBlcXVhbGl0eS5cbiAgICBpZiAodHJhbnNmb3JtQ2FjaGUuaGFzKHZhbHVlKSlcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybUNhY2hlLmdldCh2YWx1ZSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSB0cmFuc2Zvcm1DYWNoYWJsZVZhbHVlKHZhbHVlKTtcbiAgICAvLyBOb3QgYWxsIHR5cGVzIGFyZSB0cmFuc2Zvcm1lZC5cbiAgICAvLyBUaGVzZSBtYXkgYmUgcHJpbWl0aXZlIHR5cGVzLCBzbyB0aGV5IGNhbid0IGJlIFdlYWtNYXAga2V5cy5cbiAgICBpZiAobmV3VmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgIHRyYW5zZm9ybUNhY2hlLnNldCh2YWx1ZSwgbmV3VmFsdWUpO1xuICAgICAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KG5ld1ZhbHVlLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBuZXdWYWx1ZTtcbn1cbmNvbnN0IHVud3JhcCA9ICh2YWx1ZSkgPT4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLmdldCh2YWx1ZSk7XG5cbmV4cG9ydCB7IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSBhcyBhLCBpbnN0YW5jZU9mQW55IGFzIGksIHJlcGxhY2VUcmFwcyBhcyByLCB1bndyYXAgYXMgdSwgd3JhcCBhcyB3IH07XG4iLCJpbXBvcnQgeyB3IGFzIHdyYXAsIHIgYXMgcmVwbGFjZVRyYXBzIH0gZnJvbSAnLi93cmFwLWlkYi12YWx1ZS5qcyc7XG5leHBvcnQgeyB1IGFzIHVud3JhcCwgdyBhcyB3cmFwIH0gZnJvbSAnLi93cmFwLWlkYi12YWx1ZS5qcyc7XG5cbi8qKlxuICogT3BlbiBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICogQHBhcmFtIHZlcnNpb24gU2NoZW1hIHZlcnNpb24uXG4gKiBAcGFyYW0gY2FsbGJhY2tzIEFkZGl0aW9uYWwgY2FsbGJhY2tzLlxuICovXG5mdW5jdGlvbiBvcGVuREIobmFtZSwgdmVyc2lvbiwgeyBibG9ja2VkLCB1cGdyYWRlLCBibG9ja2luZywgdGVybWluYXRlZCB9ID0ge30pIHtcbiAgICBjb25zdCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4obmFtZSwgdmVyc2lvbik7XG4gICAgY29uc3Qgb3BlblByb21pc2UgPSB3cmFwKHJlcXVlc3QpO1xuICAgIGlmICh1cGdyYWRlKSB7XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcigndXBncmFkZW5lZWRlZCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdXBncmFkZSh3cmFwKHJlcXVlc3QucmVzdWx0KSwgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgd3JhcChyZXF1ZXN0LnRyYW5zYWN0aW9uKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZClcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdibG9ja2VkJywgKCkgPT4gYmxvY2tlZCgpKTtcbiAgICBvcGVuUHJvbWlzZVxuICAgICAgICAudGhlbigoZGIpID0+IHtcbiAgICAgICAgaWYgKHRlcm1pbmF0ZWQpXG4gICAgICAgICAgICBkYi5hZGRFdmVudExpc3RlbmVyKCdjbG9zZScsICgpID0+IHRlcm1pbmF0ZWQoKSk7XG4gICAgICAgIGlmIChibG9ja2luZylcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoKSA9PiBibG9ja2luZygpKTtcbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZClcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdibG9ja2VkJywgKCkgPT4gYmxvY2tlZCgpKTtcbiAgICByZXR1cm4gd3JhcChyZXF1ZXN0KS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG59XG5cbmNvbnN0IHJlYWRNZXRob2RzID0gWydnZXQnLCAnZ2V0S2V5JywgJ2dldEFsbCcsICdnZXRBbGxLZXlzJywgJ2NvdW50J107XG5jb25zdCB3cml0ZU1ldGhvZHMgPSBbJ3B1dCcsICdhZGQnLCAnZGVsZXRlJywgJ2NsZWFyJ107XG5jb25zdCBjYWNoZWRNZXRob2RzID0gbmV3IE1hcCgpO1xuZnVuY3Rpb24gZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkge1xuICAgIGlmICghKHRhcmdldCBpbnN0YW5jZW9mIElEQkRhdGFiYXNlICYmXG4gICAgICAgICEocHJvcCBpbiB0YXJnZXQpICYmXG4gICAgICAgIHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoY2FjaGVkTWV0aG9kcy5nZXQocHJvcCkpXG4gICAgICAgIHJldHVybiBjYWNoZWRNZXRob2RzLmdldChwcm9wKTtcbiAgICBjb25zdCB0YXJnZXRGdW5jTmFtZSA9IHByb3AucmVwbGFjZSgvRnJvbUluZGV4JC8sICcnKTtcbiAgICBjb25zdCB1c2VJbmRleCA9IHByb3AgIT09IHRhcmdldEZ1bmNOYW1lO1xuICAgIGNvbnN0IGlzV3JpdGUgPSB3cml0ZU1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpO1xuICAgIGlmIChcbiAgICAvLyBCYWlsIGlmIHRoZSB0YXJnZXQgZG9lc24ndCBleGlzdCBvbiB0aGUgdGFyZ2V0LiBFZywgZ2V0QWxsIGlzbid0IGluIEVkZ2UuXG4gICAgISh0YXJnZXRGdW5jTmFtZSBpbiAodXNlSW5kZXggPyBJREJJbmRleCA6IElEQk9iamVjdFN0b3JlKS5wcm90b3R5cGUpIHx8XG4gICAgICAgICEoaXNXcml0ZSB8fCByZWFkTWV0aG9kcy5pbmNsdWRlcyh0YXJnZXRGdW5jTmFtZSkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gYXN5bmMgZnVuY3Rpb24gKHN0b3JlTmFtZSwgLi4uYXJncykge1xuICAgICAgICAvLyBpc1dyaXRlID8gJ3JlYWR3cml0ZScgOiB1bmRlZmluZWQgZ3ppcHBzIGJldHRlciwgYnV0IGZhaWxzIGluIEVkZ2UgOihcbiAgICAgICAgY29uc3QgdHggPSB0aGlzLnRyYW5zYWN0aW9uKHN0b3JlTmFtZSwgaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogJ3JlYWRvbmx5Jyk7XG4gICAgICAgIGxldCB0YXJnZXQgPSB0eC5zdG9yZTtcbiAgICAgICAgaWYgKHVzZUluZGV4KVxuICAgICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LmluZGV4KGFyZ3Muc2hpZnQoKSk7XG4gICAgICAgIC8vIE11c3QgcmVqZWN0IGlmIG9wIHJlamVjdHMuXG4gICAgICAgIC8vIElmIGl0J3MgYSB3cml0ZSBvcGVyYXRpb24sIG11c3QgcmVqZWN0IGlmIHR4LmRvbmUgcmVqZWN0cy5cbiAgICAgICAgLy8gTXVzdCByZWplY3Qgd2l0aCBvcCByZWplY3Rpb24gZmlyc3QuXG4gICAgICAgIC8vIE11c3QgcmVzb2x2ZSB3aXRoIG9wIHZhbHVlLlxuICAgICAgICAvLyBNdXN0IGhhbmRsZSBib3RoIHByb21pc2VzIChubyB1bmhhbmRsZWQgcmVqZWN0aW9ucylcbiAgICAgICAgcmV0dXJuIChhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgICAgICB0YXJnZXRbdGFyZ2V0RnVuY05hbWVdKC4uLmFyZ3MpLFxuICAgICAgICAgICAgaXNXcml0ZSAmJiB0eC5kb25lLFxuICAgICAgICBdKSlbMF07XG4gICAgfTtcbiAgICBjYWNoZWRNZXRob2RzLnNldChwcm9wLCBtZXRob2QpO1xuICAgIHJldHVybiBtZXRob2Q7XG59XG5yZXBsYWNlVHJhcHMoKG9sZFRyYXBzKSA9PiAoe1xuICAgIC4uLm9sZFRyYXBzLFxuICAgIGdldDogKHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpID0+IGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSxcbiAgICBoYXM6ICh0YXJnZXQsIHByb3ApID0+ICEhZ2V0TWV0aG9kKHRhcmdldCwgcHJvcCkgfHwgb2xkVHJhcHMuaGFzKHRhcmdldCwgcHJvcCksXG59KSk7XG5cbmV4cG9ydCB7IGRlbGV0ZURCLCBvcGVuREIgfTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgQ29tcG9uZW50Q29udGFpbmVyIH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgeyBMb2dnZXIsIHNldFVzZXJMb2dIYW5kbGVyLCBzZXRMb2dMZXZlbCBhcyBzZXRMb2dMZXZlbCQxIH0gZnJvbSAnQGZpcmViYXNlL2xvZ2dlcic7XG5pbXBvcnQgeyBFcnJvckZhY3RvcnksIGdldERlZmF1bHRBcHBDb25maWcsIGRlZXBFcXVhbCwgRmlyZWJhc2VFcnJvciwgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcsIGlzSW5kZXhlZERCQXZhaWxhYmxlLCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuZXhwb3J0IHsgRmlyZWJhc2VFcnJvciB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IG9wZW5EQiB9IGZyb20gJ2lkYic7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNsYXNzIFBsYXRmb3JtTG9nZ2VyU2VydmljZUltcGwge1xyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICB9XHJcbiAgICAvLyBJbiBpbml0aWFsIGltcGxlbWVudGF0aW9uLCB0aGlzIHdpbGwgYmUgY2FsbGVkIGJ5IGluc3RhbGxhdGlvbnMgb25cclxuICAgIC8vIGF1dGggdG9rZW4gcmVmcmVzaCwgYW5kIGluc3RhbGxhdGlvbnMgd2lsbCBzZW5kIHRoaXMgc3RyaW5nLlxyXG4gICAgZ2V0UGxhdGZvcm1JbmZvU3RyaW5nKCkge1xyXG4gICAgICAgIGNvbnN0IHByb3ZpZGVycyA9IHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVycygpO1xyXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBwcm92aWRlcnMgYW5kIGdldCBsaWJyYXJ5L3ZlcnNpb24gcGFpcnMgZnJvbSBhbnkgdGhhdCBhcmVcclxuICAgICAgICAvLyB2ZXJzaW9uIGNvbXBvbmVudHMuXHJcbiAgICAgICAgcmV0dXJuIHByb3ZpZGVyc1xyXG4gICAgICAgICAgICAubWFwKHByb3ZpZGVyID0+IHtcclxuICAgICAgICAgICAgaWYgKGlzVmVyc2lvblNlcnZpY2VQcm92aWRlcihwcm92aWRlcikpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNlcnZpY2UgPSBwcm92aWRlci5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtzZXJ2aWNlLmxpYnJhcnl9LyR7c2VydmljZS52ZXJzaW9ufWA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIobG9nU3RyaW5nID0+IGxvZ1N0cmluZylcclxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIHByb3ZpZGVyIGNoZWNrIGlmIHRoaXMgcHJvdmlkZXIgcHJvdmlkZXMgYSBWZXJzaW9uU2VydmljZVxyXG4gKlxyXG4gKiBOT1RFOiBVc2luZyBQcm92aWRlcjwnYXBwLXZlcnNpb24nPiBpcyBhIGhhY2sgdG8gaW5kaWNhdGUgdGhhdCB0aGUgcHJvdmlkZXJcclxuICogcHJvdmlkZXMgVmVyc2lvblNlcnZpY2UuIFRoZSBwcm92aWRlciBpcyBub3QgbmVjZXNzYXJpbHkgYSAnYXBwLXZlcnNpb24nXHJcbiAqIHByb3ZpZGVyLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNWZXJzaW9uU2VydmljZVByb3ZpZGVyKHByb3ZpZGVyKSB7XHJcbiAgICBjb25zdCBjb21wb25lbnQgPSBwcm92aWRlci5nZXRDb21wb25lbnQoKTtcclxuICAgIHJldHVybiAoY29tcG9uZW50ID09PSBudWxsIHx8IGNvbXBvbmVudCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29tcG9uZW50LnR5cGUpID09PSBcIlZFUlNJT05cIiAvKiBWRVJTSU9OICovO1xyXG59XG5cbmNvbnN0IG5hbWUkbyA9IFwiQGZpcmViYXNlL2FwcFwiO1xuY29uc3QgdmVyc2lvbiQxID0gXCIwLjguMlwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdAZmlyZWJhc2UvYXBwJyk7XG5cbmNvbnN0IG5hbWUkbiA9IFwiQGZpcmViYXNlL2FwcC1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRtID0gXCJAZmlyZWJhc2UvYW5hbHl0aWNzLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGwgPSBcIkBmaXJlYmFzZS9hbmFseXRpY3NcIjtcblxuY29uc3QgbmFtZSRrID0gXCJAZmlyZWJhc2UvYXBwLWNoZWNrLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGogPSBcIkBmaXJlYmFzZS9hcHAtY2hlY2tcIjtcblxuY29uc3QgbmFtZSRpID0gXCJAZmlyZWJhc2UvYXV0aFwiO1xuXG5jb25zdCBuYW1lJGggPSBcIkBmaXJlYmFzZS9hdXRoLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGcgPSBcIkBmaXJlYmFzZS9kYXRhYmFzZVwiO1xuXG5jb25zdCBuYW1lJGYgPSBcIkBmaXJlYmFzZS9kYXRhYmFzZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRlID0gXCJAZmlyZWJhc2UvZnVuY3Rpb25zXCI7XG5cbmNvbnN0IG5hbWUkZCA9IFwiQGZpcmViYXNlL2Z1bmN0aW9ucy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRjID0gXCJAZmlyZWJhc2UvaW5zdGFsbGF0aW9uc1wiO1xuXG5jb25zdCBuYW1lJGIgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJGEgPSBcIkBmaXJlYmFzZS9tZXNzYWdpbmdcIjtcblxuY29uc3QgbmFtZSQ5ID0gXCJAZmlyZWJhc2UvbWVzc2FnaW5nLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDggPSBcIkBmaXJlYmFzZS9wZXJmb3JtYW5jZVwiO1xuXG5jb25zdCBuYW1lJDcgPSBcIkBmaXJlYmFzZS9wZXJmb3JtYW5jZS1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQ2ID0gXCJAZmlyZWJhc2UvcmVtb3RlLWNvbmZpZ1wiO1xuXG5jb25zdCBuYW1lJDUgPSBcIkBmaXJlYmFzZS9yZW1vdGUtY29uZmlnLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDQgPSBcIkBmaXJlYmFzZS9zdG9yYWdlXCI7XG5cbmNvbnN0IG5hbWUkMyA9IFwiQGZpcmViYXNlL3N0b3JhZ2UtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkMiA9IFwiQGZpcmViYXNlL2ZpcmVzdG9yZVwiO1xuXG5jb25zdCBuYW1lJDEgPSBcIkBmaXJlYmFzZS9maXJlc3RvcmUtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUgPSBcImZpcmViYXNlXCI7XG5jb25zdCB2ZXJzaW9uID0gXCI5LjEyLjFcIjtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGFwcCBuYW1lXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9FTlRSWV9OQU1FID0gJ1tERUZBVUxUXSc7XHJcbmNvbnN0IFBMQVRGT1JNX0xPR19TVFJJTkcgPSB7XHJcbiAgICBbbmFtZSRvXTogJ2ZpcmUtY29yZScsXHJcbiAgICBbbmFtZSRuXTogJ2ZpcmUtY29yZS1jb21wYXQnLFxyXG4gICAgW25hbWUkbF06ICdmaXJlLWFuYWx5dGljcycsXHJcbiAgICBbbmFtZSRtXTogJ2ZpcmUtYW5hbHl0aWNzLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRqXTogJ2ZpcmUtYXBwLWNoZWNrJyxcclxuICAgIFtuYW1lJGtdOiAnZmlyZS1hcHAtY2hlY2stY29tcGF0JyxcclxuICAgIFtuYW1lJGldOiAnZmlyZS1hdXRoJyxcclxuICAgIFtuYW1lJGhdOiAnZmlyZS1hdXRoLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRnXTogJ2ZpcmUtcnRkYicsXHJcbiAgICBbbmFtZSRmXTogJ2ZpcmUtcnRkYi1jb21wYXQnLFxyXG4gICAgW25hbWUkZV06ICdmaXJlLWZuJyxcclxuICAgIFtuYW1lJGRdOiAnZmlyZS1mbi1jb21wYXQnLFxyXG4gICAgW25hbWUkY106ICdmaXJlLWlpZCcsXHJcbiAgICBbbmFtZSRiXTogJ2ZpcmUtaWlkLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRhXTogJ2ZpcmUtZmNtJyxcclxuICAgIFtuYW1lJDldOiAnZmlyZS1mY20tY29tcGF0JyxcclxuICAgIFtuYW1lJDhdOiAnZmlyZS1wZXJmJyxcclxuICAgIFtuYW1lJDddOiAnZmlyZS1wZXJmLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQ2XTogJ2ZpcmUtcmMnLFxyXG4gICAgW25hbWUkNV06ICdmaXJlLXJjLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQ0XTogJ2ZpcmUtZ2NzJyxcclxuICAgIFtuYW1lJDNdOiAnZmlyZS1nY3MtY29tcGF0JyxcclxuICAgIFtuYW1lJDJdOiAnZmlyZS1mc3QnLFxyXG4gICAgW25hbWUkMV06ICdmaXJlLWZzdC1jb21wYXQnLFxyXG4gICAgJ2ZpcmUtanMnOiAnZmlyZS1qcycsXHJcbiAgICBbbmFtZV06ICdmaXJlLWpzLWFsbCdcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuY29uc3QgX2FwcHMgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBSZWdpc3RlcmVkIGNvbXBvbmVudHMuXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuY29uc3QgX2NvbXBvbmVudHMgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBAcGFyYW0gY29tcG9uZW50IC0gdGhlIGNvbXBvbmVudCBiZWluZyBhZGRlZCB0byB0aGlzIGFwcCdzIGNvbnRhaW5lclxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9hZGRDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXBwLmNvbnRhaW5lci5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBDb21wb25lbnQgJHtjb21wb25lbnQubmFtZX0gZmFpbGVkIHRvIHJlZ2lzdGVyIHdpdGggRmlyZWJhc2VBcHAgJHthcHAubmFtZX1gLCBlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoYXBwLCBjb21wb25lbnQpIHtcclxuICAgIGFwcC5jb250YWluZXIuYWRkT3JPdmVyd3JpdGVDb21wb25lbnQoY29tcG9uZW50KTtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gcmVnaXN0ZXJcclxuICogQHJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGNvbXBvbmVudCBpcyByZWdpc3RlcmVkIHN1Y2Nlc3NmdWxseVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9yZWdpc3RlckNvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnQubmFtZTtcclxuICAgIGlmIChfY29tcG9uZW50cy5oYXMoY29tcG9uZW50TmFtZSkpIHtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYFRoZXJlIHdlcmUgbXVsdGlwbGUgYXR0ZW1wdHMgdG8gcmVnaXN0ZXIgY29tcG9uZW50ICR7Y29tcG9uZW50TmFtZX0uYCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgX2NvbXBvbmVudHMuc2V0KGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudCk7XHJcbiAgICAvLyBhZGQgdGhlIGNvbXBvbmVudCB0byBleGlzdGluZyBhcHAgaW5zdGFuY2VzXHJcbiAgICBmb3IgKGNvbnN0IGFwcCBvZiBfYXBwcy52YWx1ZXMoKSkge1xyXG4gICAgICAgIF9hZGRDb21wb25lbnQoYXBwLCBjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBGaXJlYmFzZUFwcCBpbnN0YW5jZVxyXG4gKiBAcGFyYW0gbmFtZSAtIHNlcnZpY2UgbmFtZVxyXG4gKlxyXG4gKiBAcmV0dXJucyB0aGUgcHJvdmlkZXIgZm9yIHRoZSBzZXJ2aWNlIHdpdGggdGhlIG1hdGNoaW5nIG5hbWVcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKSB7XHJcbiAgICBjb25zdCBoZWFydGJlYXRDb250cm9sbGVyID0gYXBwLmNvbnRhaW5lclxyXG4gICAgICAgIC5nZXRQcm92aWRlcignaGVhcnRiZWF0JylcclxuICAgICAgICAuZ2V0SW1tZWRpYXRlKHsgb3B0aW9uYWw6IHRydWUgfSk7XHJcbiAgICBpZiAoaGVhcnRiZWF0Q29udHJvbGxlcikge1xyXG4gICAgICAgIHZvaWQgaGVhcnRiZWF0Q29udHJvbGxlci50cmlnZ2VySGVhcnRiZWF0KCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXBwLmNvbnRhaW5lci5nZXRQcm92aWRlcihuYW1lKTtcclxufVxyXG4vKipcclxuICpcclxuICogQHBhcmFtIGFwcCAtIEZpcmViYXNlQXBwIGluc3RhbmNlXHJcbiAqIEBwYXJhbSBuYW1lIC0gc2VydmljZSBuYW1lXHJcbiAqIEBwYXJhbSBpbnN0YW5jZUlkZW50aWZpZXIgLSBzZXJ2aWNlIGluc3RhbmNlIGlkZW50aWZpZXIgaW4gY2FzZSB0aGUgc2VydmljZSBzdXBwb3J0cyBtdWx0aXBsZSBpbnN0YW5jZXNcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfcmVtb3ZlU2VydmljZUluc3RhbmNlKGFwcCwgbmFtZSwgaW5zdGFuY2VJZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICBfZ2V0UHJvdmlkZXIoYXBwLCBuYW1lKS5jbGVhckluc3RhbmNlKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbn1cclxuLyoqXHJcbiAqIFRlc3Qgb25seVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIF9jbGVhckNvbXBvbmVudHMoKSB7XHJcbiAgICBfY29tcG9uZW50cy5jbGVhcigpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEVSUk9SUyA9IHtcclxuICAgIFtcIm5vLWFwcFwiIC8qIE5PX0FQUCAqL106IFwiTm8gRmlyZWJhc2UgQXBwICd7JGFwcE5hbWV9JyBoYXMgYmVlbiBjcmVhdGVkIC0gXCIgK1xyXG4gICAgICAgICdjYWxsIEZpcmViYXNlIEFwcC5pbml0aWFsaXplQXBwKCknLFxyXG4gICAgW1wiYmFkLWFwcC1uYW1lXCIgLyogQkFEX0FQUF9OQU1FICovXTogXCJJbGxlZ2FsIEFwcCBuYW1lOiAneyRhcHBOYW1lfVwiLFxyXG4gICAgW1wiZHVwbGljYXRlLWFwcFwiIC8qIERVUExJQ0FURV9BUFAgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBleGlzdHMgd2l0aCBkaWZmZXJlbnQgb3B0aW9ucyBvciBjb25maWdcIixcclxuICAgIFtcImFwcC1kZWxldGVkXCIgLyogQVBQX0RFTEVURUQgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBkZWxldGVkXCIsXHJcbiAgICBbXCJuby1vcHRpb25zXCIgLyogTk9fT1BUSU9OUyAqL106ICdOZWVkIHRvIHByb3ZpZGUgb3B0aW9ucywgd2hlbiBub3QgYmVpbmcgZGVwbG95ZWQgdG8gaG9zdGluZyB2aWEgc291cmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWFwcC1hcmd1bWVudFwiIC8qIElOVkFMSURfQVBQX0FSR1VNRU5UICovXTogJ2ZpcmViYXNlLnskYXBwTmFtZX0oKSB0YWtlcyBlaXRoZXIgbm8gYXJndW1lbnQgb3IgYSAnICtcclxuICAgICAgICAnRmlyZWJhc2UgQXBwIGluc3RhbmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWxvZy1hcmd1bWVudFwiIC8qIElOVkFMSURfTE9HX0FSR1VNRU5UICovXTogJ0ZpcnN0IGFyZ3VtZW50IHRvIGBvbkxvZ2AgbXVzdCBiZSBudWxsIG9yIGEgZnVuY3Rpb24uJyxcclxuICAgIFtcImlkYi1vcGVuXCIgLyogSURCX09QRU4gKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gb3BlbmluZyBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiaWRiLWdldFwiIC8qIElEQl9HRVQgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gcmVhZGluZyBmcm9tIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJpZGItc2V0XCIgLyogSURCX1dSSVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIHdyaXRpbmcgdG8gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcImlkYi1kZWxldGVcIiAvKiBJREJfREVMRVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIGRlbGV0aW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJ1xyXG59O1xyXG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeSgnYXBwJywgJ0ZpcmViYXNlJywgRVJST1JTKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgRmlyZWJhc2VBcHBJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9XHJcbiAgICAgICAgICAgIGNvbmZpZy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENvbXBvbmVudChuZXcgQ29tcG9uZW50KCdhcHAnLCAoKSA9PiB0aGlzLCBcIlBVQkxJQ1wiIC8qIFBVQkxJQyAqLykpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCgpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDtcclxuICAgIH1cclxuICAgIHNldCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQodmFsKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9IHZhbDtcclxuICAgIH1cclxuICAgIGdldCBuYW1lKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuICAgIGdldCBvcHRpb25zKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcclxuICAgIH1cclxuICAgIGdldCBjb25maWcoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XHJcbiAgICB9XHJcbiAgICBnZXQgY29udGFpbmVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb250YWluZXI7XHJcbiAgICB9XHJcbiAgICBnZXQgaXNEZWxldGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0RlbGV0ZWQ7XHJcbiAgICB9XHJcbiAgICBzZXQgaXNEZWxldGVkKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2lzRGVsZXRlZCA9IHZhbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsIHRocm93IGFuIEVycm9yIGlmIHRoZSBBcHAgaGFzIGFscmVhZHkgYmVlbiBkZWxldGVkIC1cclxuICAgICAqIHVzZSBiZWZvcmUgcGVyZm9ybWluZyBBUEkgYWN0aW9ucyBvbiB0aGUgQXBwLlxyXG4gICAgICovXHJcbiAgICBjaGVja0Rlc3Ryb3llZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5pc0RlbGV0ZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhcHAtZGVsZXRlZFwiIC8qIEFQUF9ERUxFVEVEICovLCB7IGFwcE5hbWU6IHRoaXMuX25hbWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaGUgY3VycmVudCBTREsgdmVyc2lvbi5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgU0RLX1ZFUlNJT04gPSB2ZXJzaW9uO1xyXG5mdW5jdGlvbiBpbml0aWFsaXplQXBwKF9vcHRpb25zLCByYXdDb25maWcgPSB7fSkge1xyXG4gICAgbGV0IG9wdGlvbnMgPSBfb3B0aW9ucztcclxuICAgIGlmICh0eXBlb2YgcmF3Q29uZmlnICE9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSByYXdDb25maWc7XHJcbiAgICAgICAgcmF3Q29uZmlnID0geyBuYW1lIH07XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb25maWcgPSBPYmplY3QuYXNzaWduKHsgbmFtZTogREVGQVVMVF9FTlRSWV9OQU1FLCBhdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ6IGZhbHNlIH0sIHJhd0NvbmZpZyk7XHJcbiAgICBjb25zdCBuYW1lID0gY29uZmlnLm5hbWU7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnIHx8ICFuYW1lKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJiYWQtYXBwLW5hbWVcIiAvKiBCQURfQVBQX05BTUUgKi8sIHtcclxuICAgICAgICAgICAgYXBwTmFtZTogU3RyaW5nKG5hbWUpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0gZ2V0RGVmYXVsdEFwcENvbmZpZygpKTtcclxuICAgIGlmICghb3B0aW9ucykge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tb3B0aW9uc1wiIC8qIE5PX09QVElPTlMgKi8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZXhpc3RpbmdBcHAgPSBfYXBwcy5nZXQobmFtZSk7XHJcbiAgICBpZiAoZXhpc3RpbmdBcHApIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhlIGV4aXN0aW5nIGFwcCBpZiBvcHRpb25zIGFuZCBjb25maWcgZGVlcCBlcXVhbCB0aGUgb25lcyBpbiB0aGUgZXhpc3RpbmcgYXBwLlxyXG4gICAgICAgIGlmIChkZWVwRXF1YWwob3B0aW9ucywgZXhpc3RpbmdBcHAub3B0aW9ucykgJiZcclxuICAgICAgICAgICAgZGVlcEVxdWFsKGNvbmZpZywgZXhpc3RpbmdBcHAuY29uZmlnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdBcHA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImR1cGxpY2F0ZS1hcHBcIiAvKiBEVVBMSUNBVEVfQVBQICovLCB7IGFwcE5hbWU6IG5hbWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgY29udGFpbmVyID0gbmV3IENvbXBvbmVudENvbnRhaW5lcihuYW1lKTtcclxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIF9jb21wb25lbnRzLnZhbHVlcygpKSB7XHJcbiAgICAgICAgY29udGFpbmVyLmFkZENvbXBvbmVudChjb21wb25lbnQpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3QXBwID0gbmV3IEZpcmViYXNlQXBwSW1wbChvcHRpb25zLCBjb25maWcsIGNvbnRhaW5lcik7XHJcbiAgICBfYXBwcy5zZXQobmFtZSwgbmV3QXBwKTtcclxuICAgIHJldHVybiBuZXdBcHA7XHJcbn1cclxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSBpbnN0YW5jZS5cclxuICpcclxuICogV2hlbiBjYWxsZWQgd2l0aCBubyBhcmd1bWVudHMsIHRoZSBkZWZhdWx0IGFwcCBpcyByZXR1cm5lZC4gV2hlbiBhbiBhcHAgbmFtZVxyXG4gKiBpcyBwcm92aWRlZCwgdGhlIGFwcCBjb3JyZXNwb25kaW5nIHRvIHRoYXQgbmFtZSBpcyByZXR1cm5lZC5cclxuICpcclxuICogQW4gZXhjZXB0aW9uIGlzIHRocm93biBpZiB0aGUgYXBwIGJlaW5nIHJldHJpZXZlZCBoYXMgbm90IHlldCBiZWVuXHJcbiAqIGluaXRpYWxpemVkLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGBqYXZhc2NyaXB0XHJcbiAqIC8vIFJldHVybiB0aGUgZGVmYXVsdCBhcHBcclxuICogY29uc3QgYXBwID0gZ2V0QXBwKCk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBgYGBqYXZhc2NyaXB0XHJcbiAqIC8vIFJldHVybiBhIG5hbWVkIGFwcFxyXG4gKiBjb25zdCBvdGhlckFwcCA9IGdldEFwcChcIm90aGVyQXBwXCIpO1xyXG4gKiBgYGBcclxuICpcclxuICogQHBhcmFtIG5hbWUgLSBPcHRpb25hbCBuYW1lIG9mIHRoZSBhcHAgdG8gcmV0dXJuLiBJZiBubyBuYW1lIGlzXHJcbiAqICAgcHJvdmlkZWQsIHRoZSBkZWZhdWx0IGlzIGBcIltERUZBVUxUXVwiYC5cclxuICpcclxuICogQHJldHVybnMgVGhlIGFwcCBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm92aWRlZCBhcHAgbmFtZS5cclxuICogICBJZiBubyBhcHAgbmFtZSBpcyBwcm92aWRlZCwgdGhlIGRlZmF1bHQgYXBwIGlzIHJldHVybmVkLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRBcHAobmFtZSA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgY29uc3QgYXBwID0gX2FwcHMuZ2V0KG5hbWUpO1xyXG4gICAgaWYgKCFhcHAgJiYgbmFtZSA9PT0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVBcHAoKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcHBcIiAvKiBOT19BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcHA7XHJcbn1cclxuLyoqXHJcbiAqIEEgKHJlYWQtb25seSkgYXJyYXkgb2YgYWxsIGluaXRpYWxpemVkIGFwcHMuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFwcHMoKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShfYXBwcy52YWx1ZXMoKSk7XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlcnMgdGhpcyBhcHAgdW51c2FibGUgYW5kIGZyZWVzIHRoZSByZXNvdXJjZXMgb2YgYWxsIGFzc29jaWF0ZWRcclxuICogc2VydmljZXMuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogZGVsZXRlQXBwKGFwcClcclxuICogICAudGhlbihmdW5jdGlvbigpIHtcclxuICogICAgIGNvbnNvbGUubG9nKFwiQXBwIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gKiAgIH0pXHJcbiAqICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAqICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGRlbGV0aW5nIGFwcDpcIiwgZXJyb3IpO1xyXG4gKiAgIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXBwKGFwcCkge1xyXG4gICAgY29uc3QgbmFtZSA9IGFwcC5uYW1lO1xyXG4gICAgaWYgKF9hcHBzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgIF9hcHBzLmRlbGV0ZShuYW1lKTtcclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhcHAuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5nZXRQcm92aWRlcnMoKVxyXG4gICAgICAgICAgICAubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLmRlbGV0ZSgpKSk7XHJcbiAgICAgICAgYXBwLmlzRGVsZXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJlZ2lzdGVycyBhIGxpYnJhcnkncyBuYW1lIGFuZCB2ZXJzaW9uIGZvciBwbGF0Zm9ybSBsb2dnaW5nIHB1cnBvc2VzLlxyXG4gKiBAcGFyYW0gbGlicmFyeSAtIE5hbWUgb2YgMXAgb3IgM3AgbGlicmFyeSAoZS5nLiBmaXJlc3RvcmUsIGFuZ3VsYXJmaXJlKVxyXG4gKiBAcGFyYW0gdmVyc2lvbiAtIEN1cnJlbnQgdmVyc2lvbiBvZiB0aGF0IGxpYnJhcnkuXHJcbiAqIEBwYXJhbSB2YXJpYW50IC0gQnVuZGxlIHZhcmlhbnQsIGUuZy4sIG5vZGUsIHJuLCBldGMuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyVmVyc2lvbihsaWJyYXJ5S2V5T3JOYW1lLCB2ZXJzaW9uLCB2YXJpYW50KSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICAvLyBUT0RPOiBXZSBjYW4gdXNlIHRoaXMgY2hlY2sgdG8gd2hpdGVsaXN0IHN0cmluZ3Mgd2hlbi9pZiB3ZSBzZXQgdXBcclxuICAgIC8vIGEgZ29vZCB3aGl0ZWxpc3Qgc3lzdGVtLlxyXG4gICAgbGV0IGxpYnJhcnkgPSAoX2EgPSBQTEFURk9STV9MT0dfU1RSSU5HW2xpYnJhcnlLZXlPck5hbWVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBsaWJyYXJ5S2V5T3JOYW1lO1xyXG4gICAgaWYgKHZhcmlhbnQpIHtcclxuICAgICAgICBsaWJyYXJ5ICs9IGAtJHt2YXJpYW50fWA7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaWJyYXJ5TWlzbWF0Y2ggPSBsaWJyYXJ5Lm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBjb25zdCB2ZXJzaW9uTWlzbWF0Y2ggPSB2ZXJzaW9uLm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBpZiAobGlicmFyeU1pc21hdGNoIHx8IHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHdhcm5pbmcgPSBbXHJcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcmVnaXN0ZXIgbGlicmFyeSBcIiR7bGlicmFyeX1cIiB3aXRoIHZlcnNpb24gXCIke3ZlcnNpb259XCI6YFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgaWYgKGxpYnJhcnlNaXNtYXRjaCkge1xyXG4gICAgICAgICAgICB3YXJuaW5nLnB1c2goYGxpYnJhcnkgbmFtZSBcIiR7bGlicmFyeX1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2ggJiYgdmVyc2lvbk1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgIHdhcm5pbmcucHVzaCgnYW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2ZXJzaW9uTWlzbWF0Y2gpIHtcclxuICAgICAgICAgICAgd2FybmluZy5wdXNoKGB2ZXJzaW9uIG5hbWUgXCIke3ZlcnNpb259XCIgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzICh3aGl0ZXNwYWNlIG9yIFwiL1wiKWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2dnZXIud2Fybih3YXJuaW5nLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoYCR7bGlicmFyeX0tdmVyc2lvbmAsICgpID0+ICh7IGxpYnJhcnksIHZlcnNpb24gfSksIFwiVkVSU0lPTlwiIC8qIFZFUlNJT04gKi8pKTtcclxufVxyXG4vKipcclxuICogU2V0cyBsb2cgaGFuZGxlciBmb3IgYWxsIEZpcmViYXNlIFNES3MuXHJcbiAqIEBwYXJhbSBsb2dDYWxsYmFjayAtIEFuIG9wdGlvbmFsIGN1c3RvbSBsb2cgaGFuZGxlciB0aGF0IGV4ZWN1dGVzIHVzZXIgY29kZSB3aGVuZXZlclxyXG4gKiB0aGUgRmlyZWJhc2UgU0RLIG1ha2VzIGEgbG9nZ2luZyBjYWxsLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBvbkxvZyhsb2dDYWxsYmFjaywgb3B0aW9ucykge1xyXG4gICAgaWYgKGxvZ0NhbGxiYWNrICE9PSBudWxsICYmIHR5cGVvZiBsb2dDYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW52YWxpZC1sb2ctYXJndW1lbnRcIiAvKiBJTlZBTElEX0xPR19BUkdVTUVOVCAqLyk7XHJcbiAgICB9XHJcbiAgICBzZXRVc2VyTG9nSGFuZGxlcihsb2dDYWxsYmFjaywgb3B0aW9ucyk7XHJcbn1cclxuLyoqXHJcbiAqIFNldHMgbG9nIGxldmVsIGZvciBhbGwgRmlyZWJhc2UgU0RLcy5cclxuICpcclxuICogQWxsIG9mIHRoZSBsb2cgdHlwZXMgYWJvdmUgdGhlIGN1cnJlbnQgbG9nIGxldmVsIGFyZSBjYXB0dXJlZCAoaS5lLiBpZlxyXG4gKiB5b3Ugc2V0IHRoZSBsb2cgbGV2ZWwgdG8gYGluZm9gLCBlcnJvcnMgYXJlIGxvZ2dlZCwgYnV0IGBkZWJ1Z2AgYW5kXHJcbiAqIGB2ZXJib3NlYCBsb2dzIGFyZSBub3QpLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRMb2dMZXZlbChsb2dMZXZlbCkge1xyXG4gICAgc2V0TG9nTGV2ZWwkMShsb2dMZXZlbCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREJfTkFNRSA9ICdmaXJlYmFzZS1oZWFydGJlYXQtZGF0YWJhc2UnO1xyXG5jb25zdCBEQl9WRVJTSU9OID0gMTtcclxuY29uc3QgU1RPUkVfTkFNRSA9ICdmaXJlYmFzZS1oZWFydGJlYXQtc3RvcmUnO1xyXG5sZXQgZGJQcm9taXNlID0gbnVsbDtcclxuZnVuY3Rpb24gZ2V0RGJQcm9taXNlKCkge1xyXG4gICAgaWYgKCFkYlByb21pc2UpIHtcclxuICAgICAgICBkYlByb21pc2UgPSBvcGVuREIoREJfTkFNRSwgREJfVkVSU0lPTiwge1xyXG4gICAgICAgICAgICB1cGdyYWRlOiAoZGIsIG9sZFZlcnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHVzZSAnYnJlYWsnIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgdGhlIGZhbGwtdGhyb3VnaFxyXG4gICAgICAgICAgICAgICAgLy8gYmVoYXZpb3IgaXMgd2hhdCB3ZSB3YW50LCBiZWNhdXNlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSB2ZXJzaW9ucyBiZXR3ZWVuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBjdXJyZW50IHZlcnNpb24sIHdlIHdhbnQgQUxMIHRoZSBtaWdyYXRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVmYXVsdC1jYXNlXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9sZFZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLW9wZW5cIiAvKiBJREJfT1BFTiAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYlByb21pc2U7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKGFwcCkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgICAgIHJldHVybiBkYlxyXG4gICAgICAgICAgICAudHJhbnNhY3Rpb24oU1RPUkVfTkFNRSlcclxuICAgICAgICAgICAgLm9iamVjdFN0b3JlKFNUT1JFX05BTUUpXHJcbiAgICAgICAgICAgIC5nZXQoY29tcHV0ZUtleShhcHApKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGUubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLWdldFwiIC8qIElEQl9HRVQgKi8sIHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiAoX2EgPSBlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKGFwcCwgaGVhcnRiZWF0T2JqZWN0KSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRV9OQU1FKTtcclxuICAgICAgICBhd2FpdCBvYmplY3RTdG9yZS5wdXQoaGVhcnRiZWF0T2JqZWN0LCBjb21wdXRlS2V5KGFwcCkpO1xyXG4gICAgICAgIHJldHVybiB0eC5kb25lO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oZS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkYkdldEVycm9yID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpZGItc2V0XCIgLyogSURCX1dSSVRFICovLCB7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEVycm9yTWVzc2FnZTogKF9hID0gZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGlkYkdldEVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjb21wdXRlS2V5KGFwcCkge1xyXG4gICAgcmV0dXJuIGAke2FwcC5uYW1lfSEke2FwcC5vcHRpb25zLmFwcElkfWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgTUFYX0hFQURFUl9CWVRFUyA9IDEwMjQ7XHJcbi8vIDMwIGRheXNcclxuY29uc3QgU1RPUkVEX0hFQVJUQkVBVF9SRVRFTlRJT05fTUFYX01JTExJUyA9IDMwICogMjQgKiA2MCAqIDYwICogMTAwMDtcclxuY2xhc3MgSGVhcnRiZWF0U2VydmljZUltcGwge1xyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW4tbWVtb3J5IGNhY2hlIGZvciBoZWFydGJlYXRzLCB1c2VkIGJ5IGdldEhlYXJ0YmVhdHNIZWFkZXIoKSB0byBnZW5lcmF0ZVxyXG4gICAgICAgICAqIHRoZSBoZWFkZXIgc3RyaW5nLlxyXG4gICAgICAgICAqIFN0b3JlcyBvbmUgcmVjb3JkIHBlciBkYXRlLiBUaGlzIHdpbGwgYmUgY29uc29saWRhdGVkIGludG8gdGhlIHN0YW5kYXJkXHJcbiAgICAgICAgICogZm9ybWF0IG9mIG9uZSByZWNvcmQgcGVyIHVzZXIgYWdlbnQgc3RyaW5nIGJlZm9yZSBiZWluZyBzZW50IGFzIGEgaGVhZGVyLlxyXG4gICAgICAgICAqIFBvcHVsYXRlZCBmcm9tIGluZGV4ZWREQiB3aGVuIHRoZSBjb250cm9sbGVyIGlzIGluc3RhbnRpYXRlZCBhbmQgc2hvdWxkXHJcbiAgICAgICAgICogYmUga2VwdCBpbiBzeW5jIHdpdGggaW5kZXhlZERCLlxyXG4gICAgICAgICAqIExlYXZlIHB1YmxpYyBmb3IgZWFzaWVyIHRlc3RpbmcuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gbnVsbDtcclxuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLmNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgdGhpcy5fc3RvcmFnZSA9IG5ldyBIZWFydGJlYXRTdG9yYWdlSW1wbChhcHApO1xyXG4gICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZVByb21pc2UgPSB0aGlzLl9zdG9yYWdlLnJlYWQoKS50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSA9IHJlc3VsdDtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQ2FsbGVkIHRvIHJlcG9ydCBhIGhlYXJ0YmVhdC4gVGhlIGZ1bmN0aW9uIHdpbGwgZ2VuZXJhdGVcclxuICAgICAqIGEgSGVhcnRiZWF0c0J5VXNlckFnZW50IG9iamVjdCwgdXBkYXRlIGhlYXJ0YmVhdHNDYWNoZSwgYW5kIHBlcnNpc3QgaXRcclxuICAgICAqIHRvIEluZGV4ZWREQi5cclxuICAgICAqIE5vdGUgdGhhdCB3ZSBvbmx5IHN0b3JlIG9uZSBoZWFydGJlYXQgcGVyIGRheS4gU28gaWYgYSBoZWFydGJlYXQgZm9yIHRvZGF5IGlzXHJcbiAgICAgKiBhbHJlYWR5IGxvZ2dlZCwgc3Vic2VxdWVudCBjYWxscyB0byB0aGlzIGZ1bmN0aW9uIGluIHRoZSBzYW1lIGRheSB3aWxsIGJlIGlnbm9yZWQuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHRyaWdnZXJIZWFydGJlYXQoKSB7XHJcbiAgICAgICAgY29uc3QgcGxhdGZvcm1Mb2dnZXIgPSB0aGlzLmNvbnRhaW5lclxyXG4gICAgICAgICAgICAuZ2V0UHJvdmlkZXIoJ3BsYXRmb3JtLWxvZ2dlcicpXHJcbiAgICAgICAgICAgIC5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBcIkZpcmViYXNlIHVzZXIgYWdlbnRcIiBzdHJpbmcgZnJvbSB0aGUgcGxhdGZvcm0gbG9nZ2VyXHJcbiAgICAgICAgLy8gc2VydmljZSwgbm90IHRoZSBicm93c2VyIHVzZXIgYWdlbnQuXHJcbiAgICAgICAgY29uc3QgYWdlbnQgPSBwbGF0Zm9ybUxvZ2dlci5nZXRQbGF0Zm9ybUluZm9TdHJpbmcoKTtcclxuICAgICAgICBjb25zdCBkYXRlID0gZ2V0VVRDRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gYXdhaXQgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRG8gbm90IHN0b3JlIGEgaGVhcnRiZWF0IGlmIG9uZSBpcyBhbHJlYWR5IHN0b3JlZCBmb3IgdGhpcyBkYXlcclxuICAgICAgICAvLyBvciBpZiBhIGhlYWRlciBoYXMgYWxyZWFkeSBiZWVuIHNlbnQgdG9kYXkuXHJcbiAgICAgICAgaWYgKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPT09IGRhdGUgfHxcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMuc29tZShzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHNpbmdsZURhdGVIZWFydGJlYXQuZGF0ZSA9PT0gZGF0ZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVGhlcmUgaXMgbm8gZW50cnkgZm9yIHRoaXMgZGF0ZS4gQ3JlYXRlIG9uZS5cclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMucHVzaCh7IGRhdGUsIGFnZW50IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZW1vdmUgZW50cmllcyBvbGRlciB0aGFuIDMwIGRheXMuXHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPSB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5maWx0ZXIoc2luZ2xlRGF0ZUhlYXJ0YmVhdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhiVGltZXN0YW1wID0gbmV3IERhdGUoc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKS52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBub3cgLSBoYlRpbWVzdGFtcCA8PSBTVE9SRURfSEVBUlRCRUFUX1JFVEVOVElPTl9NQVhfTUlMTElTO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGEgYmFzZTY0IGVuY29kZWQgc3RyaW5nIHdoaWNoIGNhbiBiZSBhdHRhY2hlZCB0byB0aGUgaGVhcnRiZWF0LXNwZWNpZmljIGhlYWRlciBkaXJlY3RseS5cclxuICAgICAqIEl0IGFsc28gY2xlYXJzIGFsbCBoZWFydGJlYXRzIGZyb20gbWVtb3J5IGFzIHdlbGwgYXMgaW4gSW5kZXhlZERCLlxyXG4gICAgICpcclxuICAgICAqIE5PVEU6IENvbnN1bWluZyBwcm9kdWN0IFNES3Mgc2hvdWxkIG5vdCBzZW5kIHRoZSBoZWFkZXIgaWYgdGhpcyBtZXRob2RcclxuICAgICAqIHJldHVybnMgYW4gZW1wdHkgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBnZXRIZWFydGJlYXRzSGVhZGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgaXQncyBzdGlsbCBudWxsIG9yIHRoZSBhcnJheSBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gZGF0YSB0byBzZW5kLlxyXG4gICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwgfHxcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcclxuICAgICAgICAvLyBFeHRyYWN0IGFzIG1hbnkgaGVhcnRiZWF0cyBmcm9tIHRoZSBjYWNoZSBhcyB3aWxsIGZpdCB1bmRlciB0aGUgc2l6ZSBsaW1pdC5cclxuICAgICAgICBjb25zdCB7IGhlYXJ0YmVhdHNUb1NlbmQsIHVuc2VudEVudHJpZXMgfSA9IGV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzKTtcclxuICAgICAgICBjb25zdCBoZWFkZXJTdHJpbmcgPSBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IDIsIGhlYXJ0YmVhdHM6IGhlYXJ0YmVhdHNUb1NlbmQgfSkpO1xyXG4gICAgICAgIC8vIFN0b3JlIGxhc3Qgc2VudCBkYXRlIHRvIHByZXZlbnQgYW5vdGhlciBiZWluZyBsb2dnZWQvc2VudCBmb3IgdGhlIHNhbWUgZGF5LlxyXG4gICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5sYXN0U2VudEhlYXJ0YmVhdERhdGUgPSBkYXRlO1xyXG4gICAgICAgIGlmICh1bnNlbnRFbnRyaWVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgLy8gU3RvcmUgYW55IHVuc2VudCBlbnRyaWVzIGlmIHRoZXkgZXhpc3QuXHJcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gdW5zZW50RW50cmllcztcclxuICAgICAgICAgICAgLy8gVGhpcyBzZWVtcyBtb3JlIGxpa2VseSB0aGFuIGVtcHR5aW5nIHRoZSBhcnJheSAoYmVsb3cpIHRvIGxlYWQgdG8gc29tZSBvZGQgc3RhdGVcclxuICAgICAgICAgICAgLy8gc2luY2UgdGhlIGNhY2hlIGlzbid0IGVtcHR5IGFuZCB0aGlzIHdpbGwgYmUgY2FsbGVkIGFnYWluIG9uIHRoZSBuZXh0IHJlcXVlc3QsXHJcbiAgICAgICAgICAgIC8vIGFuZCBpcyBwcm9iYWJseSBzYWZlc3QgaWYgd2UgYXdhaXQgaXQuXHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IFtdO1xyXG4gICAgICAgICAgICAvLyBEbyBub3Qgd2FpdCBmb3IgdGhpcywgdG8gcmVkdWNlIGxhdGVuY3kuXHJcbiAgICAgICAgICAgIHZvaWQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGhlYWRlclN0cmluZztcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRVVENEYXRlU3RyaW5nKCkge1xyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgLy8gUmV0dXJucyBkYXRlIGZvcm1hdCAnWVlZWS1NTS1ERCdcclxuICAgIHJldHVybiB0b2RheS50b0lTT1N0cmluZygpLnN1YnN0cmluZygwLCAxMCk7XHJcbn1cclxuZnVuY3Rpb24gZXh0cmFjdEhlYXJ0YmVhdHNGb3JIZWFkZXIoaGVhcnRiZWF0c0NhY2hlLCBtYXhTaXplID0gTUFYX0hFQURFUl9CWVRFUykge1xyXG4gICAgLy8gSGVhcnRiZWF0cyBncm91cGVkIGJ5IHVzZXIgYWdlbnQgaW4gdGhlIHN0YW5kYXJkIGZvcm1hdCB0byBiZSBzZW50IGluXHJcbiAgICAvLyB0aGUgaGVhZGVyLlxyXG4gICAgY29uc3QgaGVhcnRiZWF0c1RvU2VuZCA9IFtdO1xyXG4gICAgLy8gU2luZ2xlIGRhdGUgZm9ybWF0IGhlYXJ0YmVhdHMgdGhhdCBhcmUgbm90IHNlbnQuXHJcbiAgICBsZXQgdW5zZW50RW50cmllcyA9IGhlYXJ0YmVhdHNDYWNoZS5zbGljZSgpO1xyXG4gICAgZm9yIChjb25zdCBzaW5nbGVEYXRlSGVhcnRiZWF0IG9mIGhlYXJ0YmVhdHNDYWNoZSkge1xyXG4gICAgICAgIC8vIExvb2sgZm9yIGFuIGV4aXN0aW5nIGVudHJ5IHdpdGggdGhlIHNhbWUgdXNlciBhZ2VudC5cclxuICAgICAgICBjb25zdCBoZWFydGJlYXRFbnRyeSA9IGhlYXJ0YmVhdHNUb1NlbmQuZmluZChoYiA9PiBoYi5hZ2VudCA9PT0gc2luZ2xlRGF0ZUhlYXJ0YmVhdC5hZ2VudCk7XHJcbiAgICAgICAgaWYgKCFoZWFydGJlYXRFbnRyeSkge1xyXG4gICAgICAgICAgICAvLyBJZiBubyBlbnRyeSBmb3IgdGhpcyB1c2VyIGFnZW50IGV4aXN0cywgY3JlYXRlIG9uZS5cclxuICAgICAgICAgICAgaGVhcnRiZWF0c1RvU2VuZC5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGFnZW50OiBzaW5nbGVEYXRlSGVhcnRiZWF0LmFnZW50LFxyXG4gICAgICAgICAgICAgICAgZGF0ZXM6IFtzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGVdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoY291bnRCeXRlcyhoZWFydGJlYXRzVG9TZW5kKSA+IG1heFNpemUpIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBoZWFkZXIgd291bGQgZXhjZWVkIG1heCBzaXplLCByZW1vdmUgdGhlIGFkZGVkIGhlYXJ0YmVhdFxyXG4gICAgICAgICAgICAgICAgLy8gZW50cnkgYW5kIHN0b3AgYWRkaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzVG9TZW5kLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnB1c2goc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlKTtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIGhlYWRlciB3b3VsZCBleGNlZWQgbWF4IHNpemUsIHJlbW92ZSB0aGUgYWRkZWQgZGF0ZVxyXG4gICAgICAgICAgICAvLyBhbmQgc3RvcCBhZGRpbmcgdG8gdGhlIGhlYWRlci5cclxuICAgICAgICAgICAgaWYgKGNvdW50Qnl0ZXMoaGVhcnRiZWF0c1RvU2VuZCkgPiBtYXhTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRFbnRyeS5kYXRlcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFBvcCB1bnNlbnQgZW50cnkgZnJvbSBxdWV1ZS4gKFNraXBwZWQgaWYgYWRkaW5nIHRoZSBlbnRyeSBleGNlZWRlZFxyXG4gICAgICAgIC8vIHF1b3RhIGFuZCB0aGUgbG9vcCBicmVha3MgZWFybHkuKVxyXG4gICAgICAgIHVuc2VudEVudHJpZXMgPSB1bnNlbnRFbnRyaWVzLnNsaWNlKDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBoZWFydGJlYXRzVG9TZW5kLFxyXG4gICAgICAgIHVuc2VudEVudHJpZXNcclxuICAgIH07XHJcbn1cclxuY2xhc3MgSGVhcnRiZWF0U3RvcmFnZUltcGwge1xyXG4gICAgY29uc3RydWN0b3IoYXBwKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICAgICAgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZSA9IHRoaXMucnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjaygpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcnVuSW5kZXhlZERCRW52aXJvbm1lbnRDaGVjaygpIHtcclxuICAgICAgICBpZiAoIWlzSW5kZXhlZERCQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gdHJ1ZSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBSZWFkIGFsbCBoZWFydGJlYXRzLlxyXG4gICAgICovXHJcbiAgICBhc3luYyByZWFkKCkge1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgaGVhcnRiZWF0czogW10gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkYkhlYXJ0YmVhdE9iamVjdCA9IGF3YWl0IHJlYWRIZWFydGJlYXRzRnJvbUluZGV4ZWREQih0aGlzLmFwcCk7XHJcbiAgICAgICAgICAgIHJldHVybiBpZGJIZWFydGJlYXRPYmplY3QgfHwgeyBoZWFydGJlYXRzOiBbXSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIG92ZXJ3cml0ZSB0aGUgc3RvcmFnZSB3aXRoIHRoZSBwcm92aWRlZCBoZWFydGJlYXRzXHJcbiAgICBhc3luYyBvdmVyd3JpdGUoaGVhcnRiZWF0c09iamVjdCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCBjYW5Vc2VJbmRleGVkREIgPSBhd2FpdCB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlO1xyXG4gICAgICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCA9IGF3YWl0IHRoaXMucmVhZCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIodGhpcy5hcHAsIHtcclxuICAgICAgICAgICAgICAgIGxhc3RTZW50SGVhcnRiZWF0RGF0ZTogKF9hID0gaGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUsXHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzOiBoZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gYWRkIGhlYXJ0YmVhdHNcclxuICAgIGFzeW5jIGFkZChoZWFydGJlYXRzT2JqZWN0KSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0ID0gYXdhaXQgdGhpcy5yZWFkKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbnRIZWFydGJlYXREYXRlOiAoX2EgPSBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHM6IFtcclxuICAgICAgICAgICAgICAgICAgICAuLi5leGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0cyxcclxuICAgICAgICAgICAgICAgICAgICAuLi5oZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDYWxjdWxhdGUgYnl0ZXMgb2YgYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgYXJyYXkgYWZ0ZXIgYmVpbmcgd3JhcHBlZFxyXG4gKiBpbiBhIHBsYXRmb3JtIGxvZ2dpbmcgaGVhZGVyIEpTT04gb2JqZWN0LCBzdHJpbmdpZmllZCwgYW5kIGNvbnZlcnRlZFxyXG4gKiB0byBiYXNlIDY0LlxyXG4gKi9cclxuZnVuY3Rpb24gY291bnRCeXRlcyhoZWFydGJlYXRzQ2FjaGUpIHtcclxuICAgIC8vIGJhc2U2NCBoYXMgYSByZXN0cmljdGVkIHNldCBvZiBjaGFyYWN0ZXJzLCBhbGwgb2Ygd2hpY2ggc2hvdWxkIGJlIDEgYnl0ZS5cclxuICAgIHJldHVybiBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhcclxuICAgIC8vIGhlYXJ0YmVhdHNDYWNoZSB3cmFwcGVyIHByb3BlcnRpZXNcclxuICAgIEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c0NhY2hlIH0pKS5sZW5ndGg7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb3JlQ29tcG9uZW50cyh2YXJpYW50KSB7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgncGxhdGZvcm0tbG9nZ2VyJywgY29udGFpbmVyID0+IG5ldyBQbGF0Zm9ybUxvZ2dlclNlcnZpY2VJbXBsKGNvbnRhaW5lciksIFwiUFJJVkFURVwiIC8qIFBSSVZBVEUgKi8pKTtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KCdoZWFydGJlYXQnLCBjb250YWluZXIgPT4gbmV3IEhlYXJ0YmVhdFNlcnZpY2VJbXBsKGNvbnRhaW5lciksIFwiUFJJVkFURVwiIC8qIFBSSVZBVEUgKi8pKTtcclxuICAgIC8vIFJlZ2lzdGVyIGBhcHBgIHBhY2thZ2UuXHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSRvLCB2ZXJzaW9uJDEsIHZhcmlhbnQpO1xyXG4gICAgLy8gQlVJTERfVEFSR0VUIHdpbGwgYmUgcmVwbGFjZWQgYnkgdmFsdWVzIGxpa2UgZXNtNSwgZXNtMjAxNywgY2pzNSwgZXRjIGR1cmluZyB0aGUgY29tcGlsYXRpb25cclxuICAgIHJlZ2lzdGVyVmVyc2lvbihuYW1lJG8sIHZlcnNpb24kMSwgJ2VzbTIwMTcnKTtcclxuICAgIC8vIFJlZ2lzdGVyIHBsYXRmb3JtIFNESyBpZGVudGlmaWVyIChubyB2ZXJzaW9uKS5cclxuICAgIHJlZ2lzdGVyVmVyc2lvbignZmlyZS1qcycsICcnKTtcclxufVxuXG4vKipcclxuICogRmlyZWJhc2UgQXBwXHJcbiAqXHJcbiAqIEByZW1hcmtzIFRoaXMgcGFja2FnZSBjb29yZGluYXRlcyB0aGUgY29tbXVuaWNhdGlvbiBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgRmlyZWJhc2UgY29tcG9uZW50c1xyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbnJlZ2lzdGVyQ29yZUNvbXBvbmVudHMoJycpO1xuXG5leHBvcnQgeyBTREtfVkVSU0lPTiwgREVGQVVMVF9FTlRSWV9OQU1FIGFzIF9ERUZBVUxUX0VOVFJZX05BTUUsIF9hZGRDb21wb25lbnQsIF9hZGRPck92ZXJ3cml0ZUNvbXBvbmVudCwgX2FwcHMsIF9jbGVhckNvbXBvbmVudHMsIF9jb21wb25lbnRzLCBfZ2V0UHJvdmlkZXIsIF9yZWdpc3RlckNvbXBvbmVudCwgX3JlbW92ZVNlcnZpY2VJbnN0YW5jZSwgZGVsZXRlQXBwLCBnZXRBcHAsIGdldEFwcHMsIGluaXRpYWxpemVBcHAsIG9uTG9nLCByZWdpc3RlclZlcnNpb24sIHNldExvZ0xldmVsIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiaW1wb3J0IHsgZ2V0QXBwLCBfZ2V0UHJvdmlkZXIsIF9yZWdpc3RlckNvbXBvbmVudCwgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgRmlyZWJhc2VFcnJvciB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IG9wZW5EQiB9IGZyb20gJ2lkYic7XG5cbmNvbnN0IG5hbWUgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zXCI7XG5jb25zdCB2ZXJzaW9uID0gXCIwLjUuMTVcIjtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgUEVORElOR19USU1FT1VUX01TID0gMTAwMDA7XHJcbmNvbnN0IFBBQ0tBR0VfVkVSU0lPTiA9IGB3OiR7dmVyc2lvbn1gO1xyXG5jb25zdCBJTlRFUk5BTF9BVVRIX1ZFUlNJT04gPSAnRklTX3YyJztcclxuY29uc3QgSU5TVEFMTEFUSU9OU19BUElfVVJMID0gJ2h0dHBzOi8vZmlyZWJhc2VpbnN0YWxsYXRpb25zLmdvb2dsZWFwaXMuY29tL3YxJztcclxuY29uc3QgVE9LRU5fRVhQSVJBVElPTl9CVUZGRVIgPSA2MCAqIDYwICogMTAwMDsgLy8gT25lIGhvdXJcclxuY29uc3QgU0VSVklDRSA9ICdpbnN0YWxsYXRpb25zJztcclxuY29uc3QgU0VSVklDRV9OQU1FID0gJ0luc3RhbGxhdGlvbnMnO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBFUlJPUl9ERVNDUklQVElPTl9NQVAgPSB7XHJcbiAgICBbXCJtaXNzaW5nLWFwcC1jb25maWctdmFsdWVzXCIgLyogTUlTU0lOR19BUFBfQ09ORklHX1ZBTFVFUyAqL106ICdNaXNzaW5nIEFwcCBjb25maWd1cmF0aW9uIHZhbHVlOiBcInskdmFsdWVOYW1lfVwiJyxcclxuICAgIFtcIm5vdC1yZWdpc3RlcmVkXCIgLyogTk9UX1JFR0lTVEVSRUQgKi9dOiAnRmlyZWJhc2UgSW5zdGFsbGF0aW9uIGlzIG5vdCByZWdpc3RlcmVkLicsXHJcbiAgICBbXCJpbnN0YWxsYXRpb24tbm90LWZvdW5kXCIgLyogSU5TVEFMTEFUSU9OX05PVF9GT1VORCAqL106ICdGaXJlYmFzZSBJbnN0YWxsYXRpb24gbm90IGZvdW5kLicsXHJcbiAgICBbXCJyZXF1ZXN0LWZhaWxlZFwiIC8qIFJFUVVFU1RfRkFJTEVEICovXTogJ3skcmVxdWVzdE5hbWV9IHJlcXVlc3QgZmFpbGVkIHdpdGggZXJyb3IgXCJ7JHNlcnZlckNvZGV9IHskc2VydmVyU3RhdHVzfTogeyRzZXJ2ZXJNZXNzYWdlfVwiJyxcclxuICAgIFtcImFwcC1vZmZsaW5lXCIgLyogQVBQX09GRkxJTkUgKi9dOiAnQ291bGQgbm90IHByb2Nlc3MgcmVxdWVzdC4gQXBwbGljYXRpb24gb2ZmbGluZS4nLFxyXG4gICAgW1wiZGVsZXRlLXBlbmRpbmctcmVnaXN0cmF0aW9uXCIgLyogREVMRVRFX1BFTkRJTkdfUkVHSVNUUkFUSU9OICovXTogXCJDYW4ndCBkZWxldGUgaW5zdGFsbGF0aW9uIHdoaWxlIHRoZXJlIGlzIGEgcGVuZGluZyByZWdpc3RyYXRpb24gcmVxdWVzdC5cIlxyXG59O1xyXG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeShTRVJWSUNFLCBTRVJWSUNFX05BTUUsIEVSUk9SX0RFU0NSSVBUSU9OX01BUCk7XHJcbi8qKiBSZXR1cm5zIHRydWUgaWYgZXJyb3IgaXMgYSBGaXJlYmFzZUVycm9yIHRoYXQgaXMgYmFzZWQgb24gYW4gZXJyb3IgZnJvbSB0aGUgc2VydmVyLiAqL1xyXG5mdW5jdGlvbiBpc1NlcnZlckVycm9yKGVycm9yKSB7XHJcbiAgICByZXR1cm4gKGVycm9yIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvciAmJlxyXG4gICAgICAgIGVycm9yLmNvZGUuaW5jbHVkZXMoXCJyZXF1ZXN0LWZhaWxlZFwiIC8qIFJFUVVFU1RfRkFJTEVEICovKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50KHsgcHJvamVjdElkIH0pIHtcclxuICAgIHJldHVybiBgJHtJTlNUQUxMQVRJT05TX0FQSV9VUkx9L3Byb2plY3RzLyR7cHJvamVjdElkfS9pbnN0YWxsYXRpb25zYDtcclxufVxyXG5mdW5jdGlvbiBleHRyYWN0QXV0aFRva2VuSW5mb0Zyb21SZXNwb25zZShyZXNwb25zZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0b2tlbjogcmVzcG9uc2UudG9rZW4sXHJcbiAgICAgICAgcmVxdWVzdFN0YXR1czogMiAvKiBDT01QTEVURUQgKi8sXHJcbiAgICAgICAgZXhwaXJlc0luOiBnZXRFeHBpcmVzSW5Gcm9tUmVzcG9uc2VFeHBpcmVzSW4ocmVzcG9uc2UuZXhwaXJlc0luKSxcclxuICAgICAgICBjcmVhdGlvblRpbWU6IERhdGUubm93KClcclxuICAgIH07XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZ2V0RXJyb3JGcm9tUmVzcG9uc2UocmVxdWVzdE5hbWUsIHJlc3BvbnNlKSB7XHJcbiAgICBjb25zdCByZXNwb25zZUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICBjb25zdCBlcnJvckRhdGEgPSByZXNwb25zZUpzb24uZXJyb3I7XHJcbiAgICByZXR1cm4gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJyZXF1ZXN0LWZhaWxlZFwiIC8qIFJFUVVFU1RfRkFJTEVEICovLCB7XHJcbiAgICAgICAgcmVxdWVzdE5hbWUsXHJcbiAgICAgICAgc2VydmVyQ29kZTogZXJyb3JEYXRhLmNvZGUsXHJcbiAgICAgICAgc2VydmVyTWVzc2FnZTogZXJyb3JEYXRhLm1lc3NhZ2UsXHJcbiAgICAgICAgc2VydmVyU3RhdHVzOiBlcnJvckRhdGEuc3RhdHVzXHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZXRIZWFkZXJzKHsgYXBpS2V5IH0pIHtcclxuICAgIHJldHVybiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAneC1nb29nLWFwaS1rZXknOiBhcGlLZXlcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdldEhlYWRlcnNXaXRoQXV0aChhcHBDb25maWcsIHsgcmVmcmVzaFRva2VuIH0pIHtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzKGFwcENvbmZpZyk7XHJcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsIGdldEF1dGhvcml6YXRpb25IZWFkZXIocmVmcmVzaFRva2VuKSk7XHJcbiAgICByZXR1cm4gaGVhZGVycztcclxufVxyXG4vKipcclxuICogQ2FsbHMgdGhlIHBhc3NlZCBpbiBmZXRjaCB3cmFwcGVyIGFuZCByZXR1cm5zIHRoZSByZXNwb25zZS5cclxuICogSWYgdGhlIHJldHVybmVkIHJlc3BvbnNlIGhhcyBhIHN0YXR1cyBvZiA1eHgsIHJlLXJ1bnMgdGhlIGZ1bmN0aW9uIG9uY2UgYW5kXHJcbiAqIHJldHVybnMgdGhlIHJlc3BvbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmV0cnlJZlNlcnZlckVycm9yKGZuKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmbigpO1xyXG4gICAgaWYgKHJlc3VsdC5zdGF0dXMgPj0gNTAwICYmIHJlc3VsdC5zdGF0dXMgPCA2MDApIHtcclxuICAgICAgICAvLyBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3IuIFJldHJ5IHJlcXVlc3QuXHJcbiAgICAgICAgcmV0dXJuIGZuKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIGdldEV4cGlyZXNJbkZyb21SZXNwb25zZUV4cGlyZXNJbihyZXNwb25zZUV4cGlyZXNJbikge1xyXG4gICAgLy8gVGhpcyB3b3JrcyBiZWNhdXNlIHRoZSBzZXJ2ZXIgd2lsbCBuZXZlciByZXNwb25kIHdpdGggZnJhY3Rpb25zIG9mIGEgc2Vjb25kLlxyXG4gICAgcmV0dXJuIE51bWJlcihyZXNwb25zZUV4cGlyZXNJbi5yZXBsYWNlKCdzJywgJzAwMCcpKTtcclxufVxyXG5mdW5jdGlvbiBnZXRBdXRob3JpemF0aW9uSGVhZGVyKHJlZnJlc2hUb2tlbikge1xyXG4gICAgcmV0dXJuIGAke0lOVEVSTkFMX0FVVEhfVkVSU0lPTn0gJHtyZWZyZXNoVG9rZW59YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KHsgYXBwQ29uZmlnLCBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIgfSwgeyBmaWQgfSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzKGFwcENvbmZpZyk7XHJcbiAgICAvLyBJZiBoZWFydGJlYXQgc2VydmljZSBleGlzdHMsIGFkZCB0aGUgaGVhcnRiZWF0IHN0cmluZyB0byB0aGUgaGVhZGVyLlxyXG4gICAgY29uc3QgaGVhcnRiZWF0U2VydmljZSA9IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlci5nZXRJbW1lZGlhdGUoe1xyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIGlmIChoZWFydGJlYXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgaGVhcnRiZWF0c0hlYWRlciA9IGF3YWl0IGhlYXJ0YmVhdFNlcnZpY2UuZ2V0SGVhcnRiZWF0c0hlYWRlcigpO1xyXG4gICAgICAgIGlmIChoZWFydGJlYXRzSGVhZGVyKSB7XHJcbiAgICAgICAgICAgIGhlYWRlcnMuYXBwZW5kKCd4LWZpcmViYXNlLWNsaWVudCcsIGhlYXJ0YmVhdHNIZWFkZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgZmlkLFxyXG4gICAgICAgIGF1dGhWZXJzaW9uOiBJTlRFUk5BTF9BVVRIX1ZFUlNJT04sXHJcbiAgICAgICAgYXBwSWQ6IGFwcENvbmZpZy5hcHBJZCxcclxuICAgICAgICBzZGtWZXJzaW9uOiBQQUNLQUdFX1ZFUlNJT05cclxuICAgIH07XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcclxuICAgIH07XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJldHJ5SWZTZXJ2ZXJFcnJvcigoKSA9PiBmZXRjaChlbmRwb2ludCwgcmVxdWVzdCkpO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VWYWx1ZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkgPSB7XHJcbiAgICAgICAgICAgIGZpZDogcmVzcG9uc2VWYWx1ZS5maWQgfHwgZmlkLFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25TdGF0dXM6IDIgLyogQ09NUExFVEVEICovLFxyXG4gICAgICAgICAgICByZWZyZXNoVG9rZW46IHJlc3BvbnNlVmFsdWUucmVmcmVzaFRva2VuLFxyXG4gICAgICAgICAgICBhdXRoVG9rZW46IGV4dHJhY3RBdXRoVG9rZW5JbmZvRnJvbVJlc3BvbnNlKHJlc3BvbnNlVmFsdWUuYXV0aFRva2VuKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHJlZ2lzdGVyZWRJbnN0YWxsYXRpb25FbnRyeTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IGF3YWl0IGdldEVycm9yRnJvbVJlc3BvbnNlKCdDcmVhdGUgSW5zdGFsbGF0aW9uJywgcmVzcG9uc2UpO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKiBSZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIGFmdGVyIGdpdmVuIHRpbWUgcGFzc2VzLiAqL1xyXG5mdW5jdGlvbiBzbGVlcChtcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgbXMpO1xyXG4gICAgfSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gYnVmZmVyVG9CYXNlNjRVcmxTYWZlKGFycmF5KSB7XHJcbiAgICBjb25zdCBiNjQgPSBidG9hKFN0cmluZy5mcm9tQ2hhckNvZGUoLi4uYXJyYXkpKTtcclxuICAgIHJldHVybiBiNjQucmVwbGFjZSgvXFwrL2csICctJykucmVwbGFjZSgvXFwvL2csICdfJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgVkFMSURfRklEX1BBVFRFUk4gPSAvXltjZGVmXVtcXHctXXsyMX0kLztcclxuY29uc3QgSU5WQUxJRF9GSUQgPSAnJztcclxuLyoqXHJcbiAqIEdlbmVyYXRlcyBhIG5ldyBGSUQgdXNpbmcgcmFuZG9tIHZhbHVlcyBmcm9tIFdlYiBDcnlwdG8gQVBJLlxyXG4gKiBSZXR1cm5zIGFuIGVtcHR5IHN0cmluZyBpZiBGSUQgZ2VuZXJhdGlvbiBmYWlscyBmb3IgYW55IHJlYXNvbi5cclxuICovXHJcbmZ1bmN0aW9uIGdlbmVyYXRlRmlkKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICAvLyBBIHZhbGlkIEZJRCBoYXMgZXhhY3RseSAyMiBiYXNlNjQgY2hhcmFjdGVycywgd2hpY2ggaXMgMTMyIGJpdHMsIG9yIDE2LjVcclxuICAgICAgICAvLyBieXRlcy4gb3VyIGltcGxlbWVudGF0aW9uIGdlbmVyYXRlcyBhIDE3IGJ5dGUgYXJyYXkgaW5zdGVhZC5cclxuICAgICAgICBjb25zdCBmaWRCeXRlQXJyYXkgPSBuZXcgVWludDhBcnJheSgxNyk7XHJcbiAgICAgICAgY29uc3QgY3J5cHRvID0gc2VsZi5jcnlwdG8gfHwgc2VsZi5tc0NyeXB0bztcclxuICAgICAgICBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGZpZEJ5dGVBcnJheSk7XHJcbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgZmlyc3QgNCByYW5kb20gYml0cyB3aXRoIHRoZSBjb25zdGFudCBGSUQgaGVhZGVyIG9mIDBiMDExMS5cclxuICAgICAgICBmaWRCeXRlQXJyYXlbMF0gPSAwYjAxMTEwMDAwICsgKGZpZEJ5dGVBcnJheVswXSAlIDBiMDAwMTAwMDApO1xyXG4gICAgICAgIGNvbnN0IGZpZCA9IGVuY29kZShmaWRCeXRlQXJyYXkpO1xyXG4gICAgICAgIHJldHVybiBWQUxJRF9GSURfUEFUVEVSTi50ZXN0KGZpZCkgPyBmaWQgOiBJTlZBTElEX0ZJRDtcclxuICAgIH1cclxuICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgIC8vIEZJRCBnZW5lcmF0aW9uIGVycm9yZWRcclxuICAgICAgICByZXR1cm4gSU5WQUxJRF9GSUQ7XHJcbiAgICB9XHJcbn1cclxuLyoqIENvbnZlcnRzIGEgRklEIFVpbnQ4QXJyYXkgdG8gYSBiYXNlNjQgc3RyaW5nIHJlcHJlc2VudGF0aW9uLiAqL1xyXG5mdW5jdGlvbiBlbmNvZGUoZmlkQnl0ZUFycmF5KSB7XHJcbiAgICBjb25zdCBiNjRTdHJpbmcgPSBidWZmZXJUb0Jhc2U2NFVybFNhZmUoZmlkQnl0ZUFycmF5KTtcclxuICAgIC8vIFJlbW92ZSB0aGUgMjNyZCBjaGFyYWN0ZXIgdGhhdCB3YXMgYWRkZWQgYmVjYXVzZSBvZiB0aGUgZXh0cmEgNCBiaXRzIGF0IHRoZVxyXG4gICAgLy8gZW5kIG9mIG91ciAxNyBieXRlIGFycmF5LCBhbmQgdGhlICc9JyBwYWRkaW5nLlxyXG4gICAgcmV0dXJuIGI2NFN0cmluZy5zdWJzdHIoMCwgMjIpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKiBSZXR1cm5zIGEgc3RyaW5nIGtleSB0aGF0IGNhbiBiZSB1c2VkIHRvIGlkZW50aWZ5IHRoZSBhcHAuICovXHJcbmZ1bmN0aW9uIGdldEtleShhcHBDb25maWcpIHtcclxuICAgIHJldHVybiBgJHthcHBDb25maWcuYXBwTmFtZX0hJHthcHBDb25maWcuYXBwSWR9YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBmaWRDaGFuZ2VDYWxsYmFja3MgPSBuZXcgTWFwKCk7XHJcbi8qKlxyXG4gKiBDYWxscyB0aGUgb25JZENoYW5nZSBjYWxsYmFja3Mgd2l0aCB0aGUgbmV3IEZJRCB2YWx1ZSwgYW5kIGJyb2FkY2FzdHMgdGhlXHJcbiAqIGNoYW5nZSB0byBvdGhlciB0YWJzLlxyXG4gKi9cclxuZnVuY3Rpb24gZmlkQ2hhbmdlZChhcHBDb25maWcsIGZpZCkge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjYWxsRmlkQ2hhbmdlQ2FsbGJhY2tzKGtleSwgZmlkKTtcclxuICAgIGJyb2FkY2FzdEZpZENoYW5nZShrZXksIGZpZCk7XHJcbn1cclxuZnVuY3Rpb24gYWRkQ2FsbGJhY2soYXBwQ29uZmlnLCBjYWxsYmFjaykge1xyXG4gICAgLy8gT3BlbiB0aGUgYnJvYWRjYXN0IGNoYW5uZWwgaWYgaXQncyBub3QgYWxyZWFkeSBvcGVuLFxyXG4gICAgLy8gdG8gYmUgYWJsZSB0byBsaXN0ZW4gdG8gY2hhbmdlIGV2ZW50cyBmcm9tIG90aGVyIHRhYnMuXHJcbiAgICBnZXRCcm9hZGNhc3RDaGFubmVsKCk7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGxldCBjYWxsYmFja1NldCA9IGZpZENoYW5nZUNhbGxiYWNrcy5nZXQoa2V5KTtcclxuICAgIGlmICghY2FsbGJhY2tTZXQpIHtcclxuICAgICAgICBjYWxsYmFja1NldCA9IG5ldyBTZXQoKTtcclxuICAgICAgICBmaWRDaGFuZ2VDYWxsYmFja3Muc2V0KGtleSwgY2FsbGJhY2tTZXQpO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2tTZXQuYWRkKGNhbGxiYWNrKTtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayhhcHBDb25maWcsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGNhbGxiYWNrU2V0ID0gZmlkQ2hhbmdlQ2FsbGJhY2tzLmdldChrZXkpO1xyXG4gICAgaWYgKCFjYWxsYmFja1NldCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNhbGxiYWNrU2V0LmRlbGV0ZShjYWxsYmFjayk7XHJcbiAgICBpZiAoY2FsbGJhY2tTZXQuc2l6ZSA9PT0gMCkge1xyXG4gICAgICAgIGZpZENoYW5nZUNhbGxiYWNrcy5kZWxldGUoa2V5KTtcclxuICAgIH1cclxuICAgIC8vIENsb3NlIGJyb2FkY2FzdCBjaGFubmVsIGlmIHRoZXJlIGFyZSBubyBtb3JlIGNhbGxiYWNrcy5cclxuICAgIGNsb3NlQnJvYWRjYXN0Q2hhbm5lbCgpO1xyXG59XHJcbmZ1bmN0aW9uIGNhbGxGaWRDaGFuZ2VDYWxsYmFja3Moa2V5LCBmaWQpIHtcclxuICAgIGNvbnN0IGNhbGxiYWNrcyA9IGZpZENoYW5nZUNhbGxiYWNrcy5nZXQoa2V5KTtcclxuICAgIGlmICghY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcclxuICAgICAgICBjYWxsYmFjayhmaWQpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGJyb2FkY2FzdEZpZENoYW5nZShrZXksIGZpZCkge1xyXG4gICAgY29uc3QgY2hhbm5lbCA9IGdldEJyb2FkY2FzdENoYW5uZWwoKTtcclxuICAgIGlmIChjaGFubmVsKSB7XHJcbiAgICAgICAgY2hhbm5lbC5wb3N0TWVzc2FnZSh7IGtleSwgZmlkIH0pO1xyXG4gICAgfVxyXG4gICAgY2xvc2VCcm9hZGNhc3RDaGFubmVsKCk7XHJcbn1cclxubGV0IGJyb2FkY2FzdENoYW5uZWwgPSBudWxsO1xyXG4vKiogT3BlbnMgYW5kIHJldHVybnMgYSBCcm9hZGNhc3RDaGFubmVsIGlmIGl0IGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci4gKi9cclxuZnVuY3Rpb24gZ2V0QnJvYWRjYXN0Q2hhbm5lbCgpIHtcclxuICAgIGlmICghYnJvYWRjYXN0Q2hhbm5lbCAmJiAnQnJvYWRjYXN0Q2hhbm5lbCcgaW4gc2VsZikge1xyXG4gICAgICAgIGJyb2FkY2FzdENoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbCgnW0ZpcmViYXNlXSBGSUQgQ2hhbmdlJyk7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbC5vbm1lc3NhZ2UgPSBlID0+IHtcclxuICAgICAgICAgICAgY2FsbEZpZENoYW5nZUNhbGxiYWNrcyhlLmRhdGEua2V5LCBlLmRhdGEuZmlkKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJyb2FkY2FzdENoYW5uZWw7XHJcbn1cclxuZnVuY3Rpb24gY2xvc2VCcm9hZGNhc3RDaGFubmVsKCkge1xyXG4gICAgaWYgKGZpZENoYW5nZUNhbGxiYWNrcy5zaXplID09PSAwICYmIGJyb2FkY2FzdENoYW5uZWwpIHtcclxuICAgICAgICBicm9hZGNhc3RDaGFubmVsLmNsb3NlKCk7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbCA9IG51bGw7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgREFUQUJBU0VfTkFNRSA9ICdmaXJlYmFzZS1pbnN0YWxsYXRpb25zLWRhdGFiYXNlJztcclxuY29uc3QgREFUQUJBU0VfVkVSU0lPTiA9IDE7XHJcbmNvbnN0IE9CSkVDVF9TVE9SRV9OQU1FID0gJ2ZpcmViYXNlLWluc3RhbGxhdGlvbnMtc3RvcmUnO1xyXG5sZXQgZGJQcm9taXNlID0gbnVsbDtcclxuZnVuY3Rpb24gZ2V0RGJQcm9taXNlKCkge1xyXG4gICAgaWYgKCFkYlByb21pc2UpIHtcclxuICAgICAgICBkYlByb21pc2UgPSBvcGVuREIoREFUQUJBU0VfTkFNRSwgREFUQUJBU0VfVkVSU0lPTiwge1xyXG4gICAgICAgICAgICB1cGdyYWRlOiAoZGIsIG9sZFZlcnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIFdlIGRvbid0IHVzZSAnYnJlYWsnIGluIHRoaXMgc3dpdGNoIHN0YXRlbWVudCwgdGhlIGZhbGwtdGhyb3VnaFxyXG4gICAgICAgICAgICAgICAgLy8gYmVoYXZpb3IgaXMgd2hhdCB3ZSB3YW50LCBiZWNhdXNlIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSB2ZXJzaW9ucyBiZXR3ZWVuXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgb2xkIHZlcnNpb24gYW5kIHRoZSBjdXJyZW50IHZlcnNpb24sIHdlIHdhbnQgQUxMIHRoZSBtaWdyYXRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyB0aGF0IGNvcnJlc3BvbmQgdG8gdGhvc2UgdmVyc2lvbnMgdG8gcnVuLCBub3Qgb25seSB0aGUgbGFzdCBvbmUuXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVmYXVsdC1jYXNlXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKG9sZFZlcnNpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRiUHJvbWlzZTtcclxufVxyXG4vKiogQXNzaWducyBvciBvdmVyd3JpdGVzIHRoZSByZWNvcmQgZm9yIHRoZSBnaXZlbiBrZXkgd2l0aCB0aGUgZ2l2ZW4gdmFsdWUuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldChhcHBDb25maWcsIHZhbHVlKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICBjb25zdCBvYmplY3RTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKTtcclxuICAgIGNvbnN0IG9sZFZhbHVlID0gKGF3YWl0IG9iamVjdFN0b3JlLmdldChrZXkpKTtcclxuICAgIGF3YWl0IG9iamVjdFN0b3JlLnB1dCh2YWx1ZSwga2V5KTtcclxuICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICBpZiAoIW9sZFZhbHVlIHx8IG9sZFZhbHVlLmZpZCAhPT0gdmFsdWUuZmlkKSB7XHJcbiAgICAgICAgZmlkQ2hhbmdlZChhcHBDb25maWcsIHZhbHVlLmZpZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn1cclxuLyoqIFJlbW92ZXMgcmVjb3JkKHMpIGZyb20gdGhlIG9iamVjdFN0b3JlIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIGtleS4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVtb3ZlKGFwcENvbmZpZykge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgYXdhaXQgdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpLmRlbGV0ZShrZXkpO1xyXG4gICAgYXdhaXQgdHguZG9uZTtcclxufVxyXG4vKipcclxuICogQXRvbWljYWxseSB1cGRhdGVzIGEgcmVjb3JkIHdpdGggdGhlIHJlc3VsdCBvZiB1cGRhdGVGbiwgd2hpY2ggZ2V0c1xyXG4gKiBjYWxsZWQgd2l0aCB0aGUgY3VycmVudCB2YWx1ZS4gSWYgbmV3VmFsdWUgaXMgdW5kZWZpbmVkLCB0aGUgcmVjb3JkIGlzXHJcbiAqIGRlbGV0ZWQgaW5zdGVhZC5cclxuICogQHJldHVybiBVcGRhdGVkIHZhbHVlXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiB1cGRhdGUoYXBwQ29uZmlnLCB1cGRhdGVGbikge1xyXG4gICAgY29uc3Qga2V5ID0gZ2V0S2V5KGFwcENvbmZpZyk7XHJcbiAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihPQkpFQ1RfU1RPUkVfTkFNRSwgJ3JlYWR3cml0ZScpO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSk7XHJcbiAgICBjb25zdCBvbGRWYWx1ZSA9IChhd2FpdCBzdG9yZS5nZXQoa2V5KSk7XHJcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHVwZGF0ZUZuKG9sZFZhbHVlKTtcclxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgYXdhaXQgc3RvcmUuZGVsZXRlKGtleSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhd2FpdCBzdG9yZS5wdXQobmV3VmFsdWUsIGtleSk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0eC5kb25lO1xyXG4gICAgaWYgKG5ld1ZhbHVlICYmICghb2xkVmFsdWUgfHwgb2xkVmFsdWUuZmlkICE9PSBuZXdWYWx1ZS5maWQpKSB7XHJcbiAgICAgICAgZmlkQ2hhbmdlZChhcHBDb25maWcsIG5ld1ZhbHVlLmZpZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmFsdWU7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFVwZGF0ZXMgYW5kIHJldHVybnMgdGhlIEluc3RhbGxhdGlvbkVudHJ5IGZyb20gdGhlIGRhdGFiYXNlLlxyXG4gKiBBbHNvIHRyaWdnZXJzIGEgcmVnaXN0cmF0aW9uIHJlcXVlc3QgaWYgaXQgaXMgbmVjZXNzYXJ5IGFuZCBwb3NzaWJsZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldEluc3RhbGxhdGlvbkVudHJ5KGluc3RhbGxhdGlvbnMpIHtcclxuICAgIGxldCByZWdpc3RyYXRpb25Qcm9taXNlO1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uRW50cnkgPSBhd2FpdCB1cGRhdGUoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBjb25zdCBpbnN0YWxsYXRpb25FbnRyeSA9IHVwZGF0ZU9yQ3JlYXRlSW5zdGFsbGF0aW9uRW50cnkob2xkRW50cnkpO1xyXG4gICAgICAgIGNvbnN0IGVudHJ5V2l0aFByb21pc2UgPSB0cmlnZ2VyUmVnaXN0cmF0aW9uSWZOZWNlc3NhcnkoaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2UgPSBlbnRyeVdpdGhQcm9taXNlLnJlZ2lzdHJhdGlvblByb21pc2U7XHJcbiAgICAgICAgcmV0dXJuIGVudHJ5V2l0aFByb21pc2UuaW5zdGFsbGF0aW9uRW50cnk7XHJcbiAgICB9KTtcclxuICAgIGlmIChpbnN0YWxsYXRpb25FbnRyeS5maWQgPT09IElOVkFMSURfRklEKSB7XHJcbiAgICAgICAgLy8gRklEIGdlbmVyYXRpb24gZmFpbGVkLiBXYWl0aW5nIGZvciB0aGUgRklEIGZyb20gdGhlIHNlcnZlci5cclxuICAgICAgICByZXR1cm4geyBpbnN0YWxsYXRpb25FbnRyeTogYXdhaXQgcmVnaXN0cmF0aW9uUHJvbWlzZSB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbnN0YWxsYXRpb25FbnRyeSxcclxuICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlXHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgbmV3IEluc3RhbGxhdGlvbiBFbnRyeSBpZiBvbmUgZG9lcyBub3QgZXhpc3QuXHJcbiAqIEFsc28gY2xlYXJzIHRpbWVkIG91dCBwZW5kaW5nIHJlcXVlc3RzLlxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlT3JDcmVhdGVJbnN0YWxsYXRpb25FbnRyeShvbGRFbnRyeSkge1xyXG4gICAgY29uc3QgZW50cnkgPSBvbGRFbnRyeSB8fCB7XHJcbiAgICAgICAgZmlkOiBnZW5lcmF0ZUZpZCgpLFxyXG4gICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqL1xyXG4gICAgfTtcclxuICAgIHJldHVybiBjbGVhclRpbWVkT3V0UmVxdWVzdChlbnRyeSk7XHJcbn1cclxuLyoqXHJcbiAqIElmIHRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaXMgbm90IHJlZ2lzdGVyZWQgeWV0LCB0aGlzIHdpbGwgdHJpZ2dlciB0aGVcclxuICogcmVnaXN0cmF0aW9uIGFuZCByZXR1cm4gYW4gSW5Qcm9ncmVzc0luc3RhbGxhdGlvbkVudHJ5LlxyXG4gKlxyXG4gKiBJZiByZWdpc3RyYXRpb25Qcm9taXNlIGRvZXMgbm90IGV4aXN0LCB0aGUgaW5zdGFsbGF0aW9uRW50cnkgaXMgZ3VhcmFudGVlZFxyXG4gKiB0byBiZSByZWdpc3RlcmVkLlxyXG4gKi9cclxuZnVuY3Rpb24gdHJpZ2dlclJlZ2lzdHJhdGlvbklmTmVjZXNzYXJ5KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICBpZiAoaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAwIC8qIE5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgIC8vIFJlZ2lzdHJhdGlvbiByZXF1aXJlZCBidXQgYXBwIGlzIG9mZmxpbmUuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvblByb21pc2VXaXRoRXJyb3IgPSBQcm9taXNlLnJlamVjdChFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1vZmZsaW5lXCIgLyogQVBQX09GRkxJTkUgKi8pKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LFxyXG4gICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZTogcmVnaXN0cmF0aW9uUHJvbWlzZVdpdGhFcnJvclxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUcnkgcmVnaXN0ZXJpbmcuIENoYW5nZSBzdGF0dXMgdG8gSU5fUFJPR1JFU1MuXHJcbiAgICAgICAgY29uc3QgaW5Qcm9ncmVzc0VudHJ5ID0ge1xyXG4gICAgICAgICAgICBmaWQ6IGluc3RhbGxhdGlvbkVudHJ5LmZpZCxcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAxIC8qIElOX1BST0dSRVNTICovLFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25UaW1lOiBEYXRlLm5vdygpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25Qcm9taXNlID0gcmVnaXN0ZXJJbnN0YWxsYXRpb24oaW5zdGFsbGF0aW9ucywgaW5Qcm9ncmVzc0VudHJ5KTtcclxuICAgICAgICByZXR1cm4geyBpbnN0YWxsYXRpb25FbnRyeTogaW5Qcm9ncmVzc0VudHJ5LCByZWdpc3RyYXRpb25Qcm9taXNlIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpbnN0YWxsYXRpb25FbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpbnN0YWxsYXRpb25FbnRyeSxcclxuICAgICAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZTogd2FpdFVudGlsRmlkUmVnaXN0cmF0aW9uKGluc3RhbGxhdGlvbnMpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB7IGluc3RhbGxhdGlvbkVudHJ5IH07XHJcbiAgICB9XHJcbn1cclxuLyoqIFRoaXMgd2lsbCBiZSBleGVjdXRlZCBvbmx5IG9uY2UgZm9yIGVhY2ggbmV3IEZpcmViYXNlIEluc3RhbGxhdGlvbi4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmVnaXN0ZXJJbnN0YWxsYXRpb24oaW5zdGFsbGF0aW9ucywgaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVnaXN0ZXJlZEluc3RhbGxhdGlvbkVudHJ5ID0gYXdhaXQgY3JlYXRlSW5zdGFsbGF0aW9uUmVxdWVzdChpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgcmV0dXJuIHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgcmVnaXN0ZXJlZEluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGlzU2VydmVyRXJyb3IoZSkgJiYgZS5jdXN0b21EYXRhLnNlcnZlckNvZGUgPT09IDQwOSkge1xyXG4gICAgICAgICAgICAvLyBTZXJ2ZXIgcmV0dXJuZWQgYSBcIkZJRCBjYW4gbm90IGJlIHVzZWRcIiBlcnJvci5cclxuICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSBuZXcgSUQgbmV4dCB0aW1lLlxyXG4gICAgICAgICAgICBhd2FpdCByZW1vdmUoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gUmVnaXN0cmF0aW9uIGZhaWxlZC4gU2V0IEZJRCBhcyBub3QgcmVnaXN0ZXJlZC5cclxuICAgICAgICAgICAgYXdhaXQgc2V0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCB7XHJcbiAgICAgICAgICAgICAgICBmaWQ6IGluc3RhbGxhdGlvbkVudHJ5LmZpZCxcclxuICAgICAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxufVxyXG4vKiogQ2FsbCBpZiBGSUQgcmVnaXN0cmF0aW9uIGlzIHBlbmRpbmcgaW4gYW5vdGhlciByZXF1ZXN0LiAqL1xyXG5hc3luYyBmdW5jdGlvbiB3YWl0VW50aWxGaWRSZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucykge1xyXG4gICAgLy8gVW5mb3J0dW5hdGVseSwgdGhlcmUgaXMgbm8gd2F5IG9mIHJlbGlhYmx5IG9ic2VydmluZyB3aGVuIGEgdmFsdWUgaW5cclxuICAgIC8vIEluZGV4ZWREQiBjaGFuZ2VzICh5ZXQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9pbmRleGVkLWRiLW9ic2VydmVycyksXHJcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHBvbGwuXHJcbiAgICBsZXQgZW50cnkgPSBhd2FpdCB1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIHdoaWxlIChlbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAvLyBjcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdCBzdGlsbCBpbiBwcm9ncmVzcy5cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDApO1xyXG4gICAgICAgIGVudHJ5ID0gYXdhaXQgdXBkYXRlSW5zdGFsbGF0aW9uUmVxdWVzdChpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAwIC8qIE5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgdGltZWQgb3V0IG9yIGZhaWxlZCBpbiBhIGRpZmZlcmVudCBjYWxsLiBUcnkgYWdhaW4uXHJcbiAgICAgICAgY29uc3QgeyBpbnN0YWxsYXRpb25FbnRyeSwgcmVnaXN0cmF0aW9uUHJvbWlzZSB9ID0gYXdhaXQgZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9ucyk7XHJcbiAgICAgICAgaWYgKHJlZ2lzdHJhdGlvblByb21pc2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlZ2lzdHJhdGlvblByb21pc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyByZWdpc3RyYXRpb25Qcm9taXNlLCBlbnRyeSBpcyByZWdpc3RlcmVkLlxyXG4gICAgICAgICAgICByZXR1cm4gaW5zdGFsbGF0aW9uRW50cnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG59XHJcbi8qKlxyXG4gKiBDYWxsZWQgb25seSBpZiB0aGVyZSBpcyBhIENyZWF0ZUluc3RhbGxhdGlvbiByZXF1ZXN0IGluIHByb2dyZXNzLlxyXG4gKlxyXG4gKiBVcGRhdGVzIHRoZSBJbnN0YWxsYXRpb25FbnRyeSBpbiB0aGUgREIgYmFzZWQgb24gdGhlIHN0YXR1cyBvZiB0aGVcclxuICogQ3JlYXRlSW5zdGFsbGF0aW9uIHJlcXVlc3QuXHJcbiAqXHJcbiAqIFJldHVybnMgdGhlIHVwZGF0ZWQgSW5zdGFsbGF0aW9uRW50cnkuXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGFwcENvbmZpZykge1xyXG4gICAgcmV0dXJuIHVwZGF0ZShhcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBpZiAoIW9sZEVudHJ5KSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW5zdGFsbGF0aW9uLW5vdC1mb3VuZFwiIC8qIElOU1RBTExBVElPTl9OT1RfRk9VTkQgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xlYXJUaW1lZE91dFJlcXVlc3Qob2xkRW50cnkpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gY2xlYXJUaW1lZE91dFJlcXVlc3QoZW50cnkpIHtcclxuICAgIGlmIChoYXNJbnN0YWxsYXRpb25SZXF1ZXN0VGltZWRPdXQoZW50cnkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZmlkOiBlbnRyeS5maWQsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqL1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbn1cclxuZnVuY3Rpb24gaGFzSW5zdGFsbGF0aW9uUmVxdWVzdFRpbWVkT3V0KGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICByZXR1cm4gKGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMSAvKiBJTl9QUk9HUkVTUyAqLyAmJlxyXG4gICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblRpbWUgKyBQRU5ESU5HX1RJTUVPVVRfTVMgPCBEYXRlLm5vdygpKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZW5lcmF0ZUF1dGhUb2tlblJlcXVlc3QoeyBhcHBDb25maWcsIGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciB9LCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXRHZW5lcmF0ZUF1dGhUb2tlbkVuZHBvaW50KGFwcENvbmZpZywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgY29uc3QgaGVhZGVycyA9IGdldEhlYWRlcnNXaXRoQXV0aChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIC8vIElmIGhlYXJ0YmVhdCBzZXJ2aWNlIGV4aXN0cywgYWRkIHRoZSBoZWFydGJlYXQgc3RyaW5nIHRvIHRoZSBoZWFkZXIuXHJcbiAgICBjb25zdCBoZWFydGJlYXRTZXJ2aWNlID0gaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLmdldEltbWVkaWF0ZSh7XHJcbiAgICAgICAgb3B0aW9uYWw6IHRydWVcclxuICAgIH0pO1xyXG4gICAgaWYgKGhlYXJ0YmVhdFNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBoZWFydGJlYXRzSGVhZGVyID0gYXdhaXQgaGVhcnRiZWF0U2VydmljZS5nZXRIZWFydGJlYXRzSGVhZGVyKCk7XHJcbiAgICAgICAgaWYgKGhlYXJ0YmVhdHNIZWFkZXIpIHtcclxuICAgICAgICAgICAgaGVhZGVycy5hcHBlbmQoJ3gtZmlyZWJhc2UtY2xpZW50JywgaGVhcnRiZWF0c0hlYWRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYm9keSA9IHtcclxuICAgICAgICBpbnN0YWxsYXRpb246IHtcclxuICAgICAgICAgICAgc2RrVmVyc2lvbjogUEFDS0FHRV9WRVJTSU9OLFxyXG4gICAgICAgICAgICBhcHBJZDogYXBwQ29uZmlnLmFwcElkXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVycyxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICBjb25zdCByZXNwb25zZVZhbHVlID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbXBsZXRlZEF1dGhUb2tlbiA9IGV4dHJhY3RBdXRoVG9rZW5JbmZvRnJvbVJlc3BvbnNlKHJlc3BvbnNlVmFsdWUpO1xyXG4gICAgICAgIHJldHVybiBjb21wbGV0ZWRBdXRoVG9rZW47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBhd2FpdCBnZXRFcnJvckZyb21SZXNwb25zZSgnR2VuZXJhdGUgQXV0aCBUb2tlbicsIHJlc3BvbnNlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRHZW5lcmF0ZUF1dGhUb2tlbkVuZHBvaW50KGFwcENvbmZpZywgeyBmaWQgfSkge1xyXG4gICAgcmV0dXJuIGAke2dldEluc3RhbGxhdGlvbnNFbmRwb2ludChhcHBDb25maWcpfS8ke2ZpZH0vYXV0aFRva2VuczpnZW5lcmF0ZWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSB2YWxpZCBhdXRoZW50aWNhdGlvbiB0b2tlbiBmb3IgdGhlIGluc3RhbGxhdGlvbi4gR2VuZXJhdGVzIGEgbmV3XHJcbiAqIHRva2VuIGlmIG9uZSBkb2Vzbid0IGV4aXN0LCBpcyBleHBpcmVkIG9yIGFib3V0IHRvIGV4cGlyZS5cclxuICpcclxuICogU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGlmIHRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaXMgcmVnaXN0ZXJlZC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHJlZnJlc2hBdXRoVG9rZW4oaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoID0gZmFsc2UpIHtcclxuICAgIGxldCB0b2tlblByb21pc2U7XHJcbiAgICBjb25zdCBlbnRyeSA9IGF3YWl0IHVwZGF0ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGlmICghaXNFbnRyeVJlZ2lzdGVyZWQob2xkRW50cnkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm90LXJlZ2lzdGVyZWRcIiAvKiBOT1RfUkVHSVNURVJFRCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG9sZEF1dGhUb2tlbiA9IG9sZEVudHJ5LmF1dGhUb2tlbjtcclxuICAgICAgICBpZiAoIWZvcmNlUmVmcmVzaCAmJiBpc0F1dGhUb2tlblZhbGlkKG9sZEF1dGhUb2tlbikpIHtcclxuICAgICAgICAgICAgLy8gVGhlcmUgaXMgYSB2YWxpZCB0b2tlbiBpbiB0aGUgREIuXHJcbiAgICAgICAgICAgIHJldHVybiBvbGRFbnRyeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob2xkQXV0aFRva2VuLnJlcXVlc3RTdGF0dXMgPT09IDEgLyogSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAgICAgLy8gVGhlcmUgYWxyZWFkeSBpcyBhIHRva2VuIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAgICAgICAgICAgIHRva2VuUHJvbWlzZSA9IHdhaXRVbnRpbEF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gTm8gdG9rZW4gb3IgdG9rZW4gZXhwaXJlZC5cclxuICAgICAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1vZmZsaW5lXCIgLyogQVBQX09GRkxJTkUgKi8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGluUHJvZ3Jlc3NFbnRyeSA9IG1ha2VBdXRoVG9rZW5SZXF1ZXN0SW5Qcm9ncmVzc0VudHJ5KG9sZEVudHJ5KTtcclxuICAgICAgICAgICAgdG9rZW5Qcm9taXNlID0gZmV0Y2hBdXRoVG9rZW5Gcm9tU2VydmVyKGluc3RhbGxhdGlvbnMsIGluUHJvZ3Jlc3NFbnRyeSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpblByb2dyZXNzRW50cnk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBhdXRoVG9rZW4gPSB0b2tlblByb21pc2VcclxuICAgICAgICA/IGF3YWl0IHRva2VuUHJvbWlzZVxyXG4gICAgICAgIDogZW50cnkuYXV0aFRva2VuO1xyXG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcclxufVxyXG4vKipcclxuICogQ2FsbCBvbmx5IGlmIEZJRCBpcyByZWdpc3RlcmVkIGFuZCBBdXRoIFRva2VuIHJlcXVlc3QgaXMgaW4gcHJvZ3Jlc3MuXHJcbiAqXHJcbiAqIFdhaXRzIHVudGlsIHRoZSBjdXJyZW50IHBlbmRpbmcgcmVxdWVzdCBmaW5pc2hlcy4gSWYgdGhlIHJlcXVlc3QgdGltZXMgb3V0LFxyXG4gKiB0cmllcyBvbmNlIGluIHRoaXMgdGhyZWFkIGFzIHdlbGwuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiB3YWl0VW50aWxBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCkge1xyXG4gICAgLy8gVW5mb3J0dW5hdGVseSwgdGhlcmUgaXMgbm8gd2F5IG9mIHJlbGlhYmx5IG9ic2VydmluZyB3aGVuIGEgdmFsdWUgaW5cclxuICAgIC8vIEluZGV4ZWREQiBjaGFuZ2VzICh5ZXQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vV0lDRy9pbmRleGVkLWRiLW9ic2VydmVycyksXHJcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHBvbGwuXHJcbiAgICBsZXQgZW50cnkgPSBhd2FpdCB1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIHdoaWxlIChlbnRyeS5hdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMSAvKiBJTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgIC8vIGdlbmVyYXRlQXV0aFRva2VuIHN0aWxsIGluIHByb2dyZXNzLlxyXG4gICAgICAgIGF3YWl0IHNsZWVwKDEwMCk7XHJcbiAgICAgICAgZW50cnkgPSBhd2FpdCB1cGRhdGVBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IGVudHJ5LmF1dGhUb2tlbjtcclxuICAgIGlmIChhdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMCAvKiBOT1RfU1RBUlRFRCAqLykge1xyXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IHRpbWVkIG91dCBvciBmYWlsZWQgaW4gYSBkaWZmZXJlbnQgY2FsbC4gVHJ5IGFnYWluLlxyXG4gICAgICAgIHJldHVybiByZWZyZXNoQXV0aFRva2VuKGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYXV0aFRva2VuO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDYWxsZWQgb25seSBpZiB0aGVyZSBpcyBhIEdlbmVyYXRlQXV0aFRva2VuIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAqXHJcbiAqIFVwZGF0ZXMgdGhlIEluc3RhbGxhdGlvbkVudHJ5IGluIHRoZSBEQiBiYXNlZCBvbiB0aGUgc3RhdHVzIG9mIHRoZVxyXG4gKiBHZW5lcmF0ZUF1dGhUb2tlbiByZXF1ZXN0LlxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSB1cGRhdGVkIEluc3RhbGxhdGlvbkVudHJ5LlxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlQXV0aFRva2VuUmVxdWVzdChhcHBDb25maWcpIHtcclxuICAgIHJldHVybiB1cGRhdGUoYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKCFpc0VudHJ5UmVnaXN0ZXJlZChvbGRFbnRyeSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJub3QtcmVnaXN0ZXJlZFwiIC8qIE5PVF9SRUdJU1RFUkVEICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgb2xkQXV0aFRva2VuID0gb2xkRW50cnkuYXV0aFRva2VuO1xyXG4gICAgICAgIGlmIChoYXNBdXRoVG9rZW5SZXF1ZXN0VGltZWRPdXQob2xkQXV0aFRva2VuKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvbGRFbnRyeSksIHsgYXV0aFRva2VuOiB7IHJlcXVlc3RTdGF0dXM6IDAgLyogTk9UX1NUQVJURUQgKi8gfSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgfSk7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdXRoVG9rZW5Gcm9tU2VydmVyKGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGF1dGhUb2tlbiA9IGF3YWl0IGdlbmVyYXRlQXV0aFRva2VuUmVxdWVzdChpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBpbnN0YWxsYXRpb25FbnRyeSksIHsgYXV0aFRva2VuIH0pO1xyXG4gICAgICAgIGF3YWl0IHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICByZXR1cm4gYXV0aFRva2VuO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoaXNTZXJ2ZXJFcnJvcihlKSAmJlxyXG4gICAgICAgICAgICAoZS5jdXN0b21EYXRhLnNlcnZlckNvZGUgPT09IDQwMSB8fCBlLmN1c3RvbURhdGEuc2VydmVyQ29kZSA9PT0gNDA0KSkge1xyXG4gICAgICAgICAgICAvLyBTZXJ2ZXIgcmV0dXJuZWQgYSBcIkZJRCBub3QgZm91bmRcIiBvciBhIFwiSW52YWxpZCBhdXRoZW50aWNhdGlvblwiIGVycm9yLlxyXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG5ldyBJRCBuZXh0IHRpbWUuXHJcbiAgICAgICAgICAgIGF3YWl0IHJlbW92ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluc3RhbGxhdGlvbkVudHJ5KSwgeyBhdXRoVG9rZW46IHsgcmVxdWVzdFN0YXR1czogMCAvKiBOT1RfU1RBUlRFRCAqLyB9IH0pO1xyXG4gICAgICAgICAgICBhd2FpdCBzZXQoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIHVwZGF0ZWRJbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaXNFbnRyeVJlZ2lzdGVyZWQoaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHJldHVybiAoaW5zdGFsbGF0aW9uRW50cnkgIT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMiAvKiBDT01QTEVURUQgKi8pO1xyXG59XHJcbmZ1bmN0aW9uIGlzQXV0aFRva2VuVmFsaWQoYXV0aFRva2VuKSB7XHJcbiAgICByZXR1cm4gKGF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAyIC8qIENPTVBMRVRFRCAqLyAmJlxyXG4gICAgICAgICFpc0F1dGhUb2tlbkV4cGlyZWQoYXV0aFRva2VuKSk7XHJcbn1cclxuZnVuY3Rpb24gaXNBdXRoVG9rZW5FeHBpcmVkKGF1dGhUb2tlbikge1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIHJldHVybiAobm93IDwgYXV0aFRva2VuLmNyZWF0aW9uVGltZSB8fFxyXG4gICAgICAgIGF1dGhUb2tlbi5jcmVhdGlvblRpbWUgKyBhdXRoVG9rZW4uZXhwaXJlc0luIDwgbm93ICsgVE9LRU5fRVhQSVJBVElPTl9CVUZGRVIpO1xyXG59XHJcbi8qKiBSZXR1cm5zIGFuIHVwZGF0ZWQgSW5zdGFsbGF0aW9uRW50cnkgd2l0aCBhbiBJblByb2dyZXNzQXV0aFRva2VuLiAqL1xyXG5mdW5jdGlvbiBtYWtlQXV0aFRva2VuUmVxdWVzdEluUHJvZ3Jlc3NFbnRyeShvbGRFbnRyeSkge1xyXG4gICAgY29uc3QgaW5Qcm9ncmVzc0F1dGhUb2tlbiA9IHtcclxuICAgICAgICByZXF1ZXN0U3RhdHVzOiAxIC8qIElOX1BST0dSRVNTICovLFxyXG4gICAgICAgIHJlcXVlc3RUaW1lOiBEYXRlLm5vdygpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb2xkRW50cnkpLCB7IGF1dGhUb2tlbjogaW5Qcm9ncmVzc0F1dGhUb2tlbiB9KTtcclxufVxyXG5mdW5jdGlvbiBoYXNBdXRoVG9rZW5SZXF1ZXN0VGltZWRPdXQoYXV0aFRva2VuKSB7XHJcbiAgICByZXR1cm4gKGF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAxIC8qIElOX1BST0dSRVNTICovICYmXHJcbiAgICAgICAgYXV0aFRva2VuLnJlcXVlc3RUaW1lICsgUEVORElOR19USU1FT1VUX01TIDwgRGF0ZS5ub3coKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gaWYgdGhlcmUgaXNuJ3Qgb25lIGZvciB0aGUgYXBwIGFuZFxyXG4gKiByZXR1cm5zIHRoZSBJbnN0YWxsYXRpb24gSUQuXHJcbiAqIEBwYXJhbSBpbnN0YWxsYXRpb25zIC0gVGhlIGBJbnN0YWxsYXRpb25zYCBpbnN0YW5jZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0SWQoaW5zdGFsbGF0aW9ucykge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgY29uc3QgeyBpbnN0YWxsYXRpb25FbnRyeSwgcmVnaXN0cmF0aW9uUHJvbWlzZSB9ID0gYXdhaXQgZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9uc0ltcGwpO1xyXG4gICAgaWYgKHJlZ2lzdHJhdGlvblByb21pc2UpIHtcclxuICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8gSWYgdGhlIGluc3RhbGxhdGlvbiBpcyBhbHJlYWR5IHJlZ2lzdGVyZWQsIHVwZGF0ZSB0aGUgYXV0aGVudGljYXRpb25cclxuICAgICAgICAvLyB0b2tlbiBpZiBuZWVkZWQuXHJcbiAgICAgICAgcmVmcmVzaEF1dGhUb2tlbihpbnN0YWxsYXRpb25zSW1wbCkuY2F0Y2goY29uc29sZS5lcnJvcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaW5zdGFsbGF0aW9uRW50cnkuZmlkO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgRmlyZWJhc2UgSW5zdGFsbGF0aW9ucyBhdXRoIHRva2VuLCBpZGVudGlmeWluZyB0aGUgY3VycmVudFxyXG4gKiBGaXJlYmFzZSBJbnN0YWxsYXRpb24uXHJcbiAqIEBwYXJhbSBpbnN0YWxsYXRpb25zIC0gVGhlIGBJbnN0YWxsYXRpb25zYCBpbnN0YW5jZS5cclxuICogQHBhcmFtIGZvcmNlUmVmcmVzaCAtIEZvcmNlIHJlZnJlc2ggcmVnYXJkbGVzcyBvZiB0b2tlbiBleHBpcmF0aW9uLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBnZXRUb2tlbihpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2ggPSBmYWxzZSkge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgYXdhaXQgY29tcGxldGVJbnN0YWxsYXRpb25SZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9uc0ltcGwpO1xyXG4gICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBlaXRoZXIgaGF2ZSBhIFJlZ2lzdGVyZWQgSW5zdGFsbGF0aW9uIGluIHRoZSBEQiwgb3Igd2UndmVcclxuICAgIC8vIGFscmVhZHkgdGhyb3duIGFuIGVycm9yLlxyXG4gICAgY29uc3QgYXV0aFRva2VuID0gYXdhaXQgcmVmcmVzaEF1dGhUb2tlbihpbnN0YWxsYXRpb25zSW1wbCwgZm9yY2VSZWZyZXNoKTtcclxuICAgIHJldHVybiBhdXRoVG9rZW4udG9rZW47XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gY29tcGxldGVJbnN0YWxsYXRpb25SZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucykge1xyXG4gICAgY29uc3QgeyByZWdpc3RyYXRpb25Qcm9taXNlIH0gPSBhd2FpdCBnZXRJbnN0YWxsYXRpb25FbnRyeShpbnN0YWxsYXRpb25zKTtcclxuICAgIGlmIChyZWdpc3RyYXRpb25Qcm9taXNlKSB7XHJcbiAgICAgICAgLy8gQSBjcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdCBpcyBpbiBwcm9ncmVzcy4gV2FpdCB1bnRpbCBpdCBmaW5pc2hlcy5cclxuICAgICAgICBhd2FpdCByZWdpc3RyYXRpb25Qcm9taXNlO1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUluc3RhbGxhdGlvblJlcXVlc3QoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXREZWxldGVFbmRwb2ludChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzV2l0aEF1dGgoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgaGVhZGVyc1xyXG4gICAgfTtcclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmV0cnlJZlNlcnZlckVycm9yKCgpID0+IGZldGNoKGVuZHBvaW50LCByZXF1ZXN0KSk7XHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgdGhyb3cgYXdhaXQgZ2V0RXJyb3JGcm9tUmVzcG9uc2UoJ0RlbGV0ZSBJbnN0YWxsYXRpb24nLCByZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0RGVsZXRlRW5kcG9pbnQoYXBwQ29uZmlnLCB7IGZpZCB9KSB7XHJcbiAgICByZXR1cm4gYCR7Z2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50KGFwcENvbmZpZyl9LyR7ZmlkfWA7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIERlbGV0ZXMgdGhlIEZpcmViYXNlIEluc3RhbGxhdGlvbiBhbmQgYWxsIGFzc29jaWF0ZWQgZGF0YS5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkZWxldGVJbnN0YWxsYXRpb25zKGluc3RhbGxhdGlvbnMpIHtcclxuICAgIGNvbnN0IHsgYXBwQ29uZmlnIH0gPSBpbnN0YWxsYXRpb25zO1xyXG4gICAgY29uc3QgZW50cnkgPSBhd2FpdCB1cGRhdGUoYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKG9sZEVudHJ5ICYmIG9sZEVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMCAvKiBOT1RfU1RBUlRFRCAqLykge1xyXG4gICAgICAgICAgICAvLyBEZWxldGUgdGhlIHVucmVnaXN0ZXJlZCBlbnRyeSB3aXRob3V0IHNlbmRpbmcgYSBkZWxldGVJbnN0YWxsYXRpb24gcmVxdWVzdC5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgfSk7XHJcbiAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAxIC8qIElOX1BST0dSRVNTICovKSB7XHJcbiAgICAgICAgICAgIC8vIENhbid0IGRlbGV0ZSB3aGlsZSB0cnlpbmcgdG8gcmVnaXN0ZXIuXHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZGVsZXRlLXBlbmRpbmctcmVnaXN0cmF0aW9uXCIgLyogREVMRVRFX1BFTkRJTkdfUkVHSVNUUkFUSU9OICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAyIC8qIENPTVBMRVRFRCAqLykge1xyXG4gICAgICAgICAgICBpZiAoIW5hdmlnYXRvci5vbkxpbmUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYXBwLW9mZmxpbmVcIiAvKiBBUFBfT0ZGTElORSAqLyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBkZWxldGVJbnN0YWxsYXRpb25SZXF1ZXN0KGFwcENvbmZpZywgZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgcmVtb3ZlKGFwcENvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFNldHMgYSBuZXcgY2FsbGJhY2sgdGhhdCB3aWxsIGdldCBjYWxsZWQgd2hlbiBJbnN0YWxsYXRpb24gSUQgY2hhbmdlcy5cclxuICogUmV0dXJucyBhbiB1bnN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IHdpbGwgcmVtb3ZlIHRoZSBjYWxsYmFjayB3aGVuIGNhbGxlZC5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIHdoZW4gRklEIGNoYW5nZXMuXHJcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBvbklkQ2hhbmdlKGluc3RhbGxhdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCB7IGFwcENvbmZpZyB9ID0gaW5zdGFsbGF0aW9ucztcclxuICAgIGFkZENhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spO1xyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICByZW1vdmVDYWxsYmFjayhhcHBDb25maWcsIGNhbGxiYWNrKTtcclxuICAgIH07XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIEluc3RhbGxhdGlvbnN9IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW5cclxuICoge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSBpbnN0YW5jZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9ucyhhcHAgPSBnZXRBcHAoKSkge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBfZ2V0UHJvdmlkZXIoYXBwLCAnaW5zdGFsbGF0aW9ucycpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbXBsO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGV4dHJhY3RBcHBDb25maWcoYXBwKSB7XHJcbiAgICBpZiAoIWFwcCB8fCAhYXBwLm9wdGlvbnMpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIENvbmZpZ3VyYXRpb24nKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwLm5hbWUpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIE5hbWUnKTtcclxuICAgIH1cclxuICAgIC8vIFJlcXVpcmVkIGFwcCBjb25maWcga2V5c1xyXG4gICAgY29uc3QgY29uZmlnS2V5cyA9IFtcclxuICAgICAgICAncHJvamVjdElkJyxcclxuICAgICAgICAnYXBpS2V5JyxcclxuICAgICAgICAnYXBwSWQnXHJcbiAgICBdO1xyXG4gICAgZm9yIChjb25zdCBrZXlOYW1lIG9mIGNvbmZpZ0tleXMpIHtcclxuICAgICAgICBpZiAoIWFwcC5vcHRpb25zW2tleU5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKGtleU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYXBwTmFtZTogYXBwLm5hbWUsXHJcbiAgICAgICAgcHJvamVjdElkOiBhcHAub3B0aW9ucy5wcm9qZWN0SWQsXHJcbiAgICAgICAgYXBpS2V5OiBhcHAub3B0aW9ucy5hcGlLZXksXHJcbiAgICAgICAgYXBwSWQ6IGFwcC5vcHRpb25zLmFwcElkXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldE1pc3NpbmdWYWx1ZUVycm9yKHZhbHVlTmFtZSkge1xyXG4gICAgcmV0dXJuIEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibWlzc2luZy1hcHAtY29uZmlnLXZhbHVlc1wiIC8qIE1JU1NJTkdfQVBQX0NPTkZJR19WQUxVRVMgKi8sIHtcclxuICAgICAgICB2YWx1ZU5hbWVcclxuICAgIH0pO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IElOU1RBTExBVElPTlNfTkFNRSA9ICdpbnN0YWxsYXRpb25zJztcclxuY29uc3QgSU5TVEFMTEFUSU9OU19OQU1FX0lOVEVSTkFMID0gJ2luc3RhbGxhdGlvbnMtaW50ZXJuYWwnO1xyXG5jb25zdCBwdWJsaWNGYWN0b3J5ID0gKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgIC8vIFRocm93cyBpZiBhcHAgaXNuJ3QgY29uZmlndXJlZCBwcm9wZXJseS5cclxuICAgIGNvbnN0IGFwcENvbmZpZyA9IGV4dHJhY3RBcHBDb25maWcoYXBwKTtcclxuICAgIGNvbnN0IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciA9IF9nZXRQcm92aWRlcihhcHAsICdoZWFydGJlYXQnKTtcclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnNJbXBsID0ge1xyXG4gICAgICAgIGFwcCxcclxuICAgICAgICBhcHBDb25maWcsXHJcbiAgICAgICAgaGVhcnRiZWF0U2VydmljZVByb3ZpZGVyLFxyXG4gICAgICAgIF9kZWxldGU6ICgpID0+IFByb21pc2UucmVzb2x2ZSgpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbXBsO1xyXG59O1xyXG5jb25zdCBpbnRlcm5hbEZhY3RvcnkgPSAoY29udGFpbmVyKSA9PiB7XHJcbiAgICBjb25zdCBhcHAgPSBjb250YWluZXIuZ2V0UHJvdmlkZXIoJ2FwcCcpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgLy8gSW50ZXJuYWwgRklTIGluc3RhbmNlIHJlbGllcyBvbiBwdWJsaWMgRklTIGluc3RhbmNlLlxyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9ucyA9IF9nZXRQcm92aWRlcihhcHAsIElOU1RBTExBVElPTlNfTkFNRSkuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW50ZXJuYWwgPSB7XHJcbiAgICAgICAgZ2V0SWQ6ICgpID0+IGdldElkKGluc3RhbGxhdGlvbnMpLFxyXG4gICAgICAgIGdldFRva2VuOiAoZm9yY2VSZWZyZXNoKSA9PiBnZXRUb2tlbihpbnN0YWxsYXRpb25zLCBmb3JjZVJlZnJlc2gpXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbnRlcm5hbDtcclxufTtcclxuZnVuY3Rpb24gcmVnaXN0ZXJJbnN0YWxsYXRpb25zKCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoSU5TVEFMTEFUSU9OU19OQU1FLCBwdWJsaWNGYWN0b3J5LCBcIlBVQkxJQ1wiIC8qIFBVQkxJQyAqLykpO1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoSU5TVEFMTEFUSU9OU19OQU1FX0lOVEVSTkFMLCBpbnRlcm5hbEZhY3RvcnksIFwiUFJJVkFURVwiIC8qIFBSSVZBVEUgKi8pKTtcclxufVxuXG4vKipcclxuICogRmlyZWJhc2UgSW5zdGFsbGF0aW9uc1xyXG4gKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbnJlZ2lzdGVySW5zdGFsbGF0aW9ucygpO1xyXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbi8vIEJVSUxEX1RBUkdFVCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHZhbHVlcyBsaWtlIGVzbTUsIGVzbTIwMTcsIGNqczUsIGV0YyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXHJcbnJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnZXNtMjAxNycpO1xuXG5leHBvcnQgeyBkZWxldGVJbnN0YWxsYXRpb25zLCBnZXRJZCwgZ2V0SW5zdGFsbGF0aW9ucywgZ2V0VG9rZW4sIG9uSWRDaGFuZ2UgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJpbXBvcnQgeyBnZXRBcHAsIF9nZXRQcm92aWRlciwgX3JlZ2lzdGVyQ29tcG9uZW50LCByZWdpc3RlclZlcnNpb24gfSBmcm9tICdAZmlyZWJhc2UvYXBwJztcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gJ0BmaXJlYmFzZS9sb2dnZXInO1xuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzLCBGaXJlYmFzZUVycm9yLCBpc0luZGV4ZWREQkF2YWlsYWJsZSwgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSwgaXNCcm93c2VyRXh0ZW5zaW9uLCBhcmVDb29raWVzRW5hYmxlZCwgZ2V0TW9kdWxhckluc3RhbmNlLCBkZWVwRXF1YWwgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCAnQGZpcmViYXNlL2luc3RhbGxhdGlvbnMnO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVHlwZSBjb25zdGFudCBmb3IgRmlyZWJhc2UgQW5hbHl0aWNzLlxyXG4gKi9cclxuY29uc3QgQU5BTFlUSUNTX1RZUEUgPSAnYW5hbHl0aWNzJztcclxuLy8gS2V5IHRvIGF0dGFjaCBGSUQgdG8gaW4gZ3RhZyBwYXJhbXMuXHJcbmNvbnN0IEdBX0ZJRF9LRVkgPSAnZmlyZWJhc2VfaWQnO1xyXG5jb25zdCBPUklHSU5fS0VZID0gJ29yaWdpbic7XHJcbmNvbnN0IEZFVENIX1RJTUVPVVRfTUlMTElTID0gNjAgKiAxMDAwO1xyXG5jb25zdCBEWU5BTUlDX0NPTkZJR19VUkwgPSAnaHR0cHM6Ly9maXJlYmFzZS5nb29nbGVhcGlzLmNvbS92MWFscGhhL3Byb2plY3RzLy0vYXBwcy97YXBwLWlkfS93ZWJDb25maWcnO1xyXG5jb25zdCBHVEFHX1VSTCA9ICdodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndGFnL2pzJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcignQGZpcmViYXNlL2FuYWx5dGljcycpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogTWFrZXNoaWZ0IHBvbHlmaWxsIGZvciBQcm9taXNlLmFsbFNldHRsZWQoKS4gUmVzb2x2ZXMgd2hlbiBhbGwgcHJvbWlzZXNcclxuICogaGF2ZSBlaXRoZXIgcmVzb2x2ZWQgb3IgcmVqZWN0ZWQuXHJcbiAqXHJcbiAqIEBwYXJhbSBwcm9taXNlcyBBcnJheSBvZiBwcm9taXNlcyB0byB3YWl0IGZvci5cclxuICovXHJcbmZ1bmN0aW9uIHByb21pc2VBbGxTZXR0bGVkKHByb21pc2VzKSB7XHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMubWFwKHByb21pc2UgPT4gcHJvbWlzZS5jYXRjaChlID0+IGUpKSk7XHJcbn1cclxuLyoqXHJcbiAqIEluc2VydHMgZ3RhZyBzY3JpcHQgdGFnIGludG8gdGhlIHBhZ2UgdG8gYXN5bmNocm9ub3VzbHkgZG93bmxvYWQgZ3RhZy5cclxuICogQHBhcmFtIGRhdGFMYXllck5hbWUgTmFtZSBvZiBkYXRhbGF5ZXIgKG1vc3Qgb2Z0ZW4gdGhlIGRlZmF1bHQsIFwiX2RhdGFMYXllclwiKS5cclxuICovXHJcbmZ1bmN0aW9uIGluc2VydFNjcmlwdFRhZyhkYXRhTGF5ZXJOYW1lLCBtZWFzdXJlbWVudElkKSB7XHJcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIC8vIFdlIGFyZSBub3QgcHJvdmlkaW5nIGFuIGFuYWx5dGljc0lkIGluIHRoZSBVUkwgYmVjYXVzZSBpdCB3b3VsZCB0cmlnZ2VyIGEgYHBhZ2Vfdmlld2BcclxuICAgIC8vIHdpdGhvdXQgZmlkLiBXZSB3aWxsIGluaXRpYWxpemUgZ2EtaWQgdXNpbmcgZ3RhZyAoY29uZmlnKSBjb21tYW5kIHRvZ2V0aGVyIHdpdGggZmlkLlxyXG4gICAgc2NyaXB0LnNyYyA9IGAke0dUQUdfVVJMfT9sPSR7ZGF0YUxheWVyTmFtZX0maWQ9JHttZWFzdXJlbWVudElkfWA7XHJcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgcmVmZXJlbmNlIHRvLCBvciBjcmVhdGUsIGdsb2JhbCBkYXRhbGF5ZXIuXHJcbiAqIEBwYXJhbSBkYXRhTGF5ZXJOYW1lIE5hbWUgb2YgZGF0YWxheWVyIChtb3N0IG9mdGVuIHRoZSBkZWZhdWx0LCBcIl9kYXRhTGF5ZXJcIikuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPckNyZWF0ZURhdGFMYXllcihkYXRhTGF5ZXJOYW1lKSB7XHJcbiAgICAvLyBDaGVjayBmb3IgZXhpc3RpbmcgZGF0YUxheWVyIGFuZCBjcmVhdGUgaWYgbmVlZGVkLlxyXG4gICAgbGV0IGRhdGFMYXllciA9IFtdO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkod2luZG93W2RhdGFMYXllck5hbWVdKSkge1xyXG4gICAgICAgIGRhdGFMYXllciA9IHdpbmRvd1tkYXRhTGF5ZXJOYW1lXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHdpbmRvd1tkYXRhTGF5ZXJOYW1lXSA9IGRhdGFMYXllcjtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhTGF5ZXI7XHJcbn1cclxuLyoqXHJcbiAqIFdyYXBwZWQgZ3RhZyBsb2dpYyB3aGVuIGd0YWcgaXMgY2FsbGVkIHdpdGggJ2NvbmZpZycgY29tbWFuZC5cclxuICpcclxuICogQHBhcmFtIGd0YWdDb3JlIEJhc2ljIGd0YWcgZnVuY3Rpb24gdGhhdCBqdXN0IGFwcGVuZHMgdG8gZGF0YUxheWVyLlxyXG4gKiBAcGFyYW0gaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCBNYXAgb2YgYXBwSWRzIHRvIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCBBcnJheSBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcCBvZiBHQSBtZWFzdXJlbWVudElEcyB0byBjb3JyZXNwb25kaW5nIEZpcmViYXNlIGFwcElkLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZCBHQSBNZWFzdXJlbWVudCBJRCB0byBzZXQgY29uZmlnIGZvci5cclxuICogQHBhcmFtIGd0YWdQYXJhbXMgR3RhZyBjb25maWcgcGFyYW1zIHRvIHNldC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGd0YWdPbkNvbmZpZyhndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIG1lYXN1cmVtZW50SWQsIGd0YWdQYXJhbXMpIHtcclxuICAgIC8vIElmIGNvbmZpZyBpcyBhbHJlYWR5IGZldGNoZWQsIHdlIGtub3cgdGhlIGFwcElkIGFuZCBjYW4gdXNlIGl0IHRvIGxvb2sgdXAgd2hhdCBGSUQgcHJvbWlzZSB3ZVxyXG4gICAgLy8vIGFyZSB3YWl0aW5nIGZvciwgYW5kIHdhaXQgb25seSBvbiB0aGF0IG9uZS5cclxuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdBcHBJZCA9IG1lYXN1cmVtZW50SWRUb0FwcElkW21lYXN1cmVtZW50SWRdO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAoY29ycmVzcG9uZGluZ0FwcElkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbY29ycmVzcG9uZGluZ0FwcElkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIElmIGNvbmZpZyBpcyBub3QgZmV0Y2hlZCB5ZXQsIHdhaXQgZm9yIGFsbCBjb25maWdzICh3ZSBkb24ndCBrbm93IHdoaWNoIG9uZSB3ZSBuZWVkKSBhbmRcclxuICAgICAgICAgICAgLy8gZmluZCB0aGUgYXBwSWQgKGlmIGFueSkgY29ycmVzcG9uZGluZyB0byB0aGlzIG1lYXN1cmVtZW50SWQuIElmIHRoZXJlIGlzIG9uZSwgd2FpdCBvblxyXG4gICAgICAgICAgICAvLyB0aGF0IGFwcElkJ3MgaW5pdGlhbGl6YXRpb24gcHJvbWlzZS4gSWYgdGhlcmUgaXMgbm9uZSwgcHJvbWlzZSByZXNvbHZlcyBhbmQgZ3RhZ1xyXG4gICAgICAgICAgICAvLyBjYWxsIGdvZXMgdGhyb3VnaC5cclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY0NvbmZpZ1Jlc3VsdHMgPSBhd2FpdCBwcm9taXNlQWxsU2V0dGxlZChkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0KTtcclxuICAgICAgICAgICAgY29uc3QgZm91bmRDb25maWcgPSBkeW5hbWljQ29uZmlnUmVzdWx0cy5maW5kKGNvbmZpZyA9PiBjb25maWcubWVhc3VyZW1lbnRJZCA9PT0gbWVhc3VyZW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZENvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFtmb3VuZENvbmZpZy5hcHBJZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcihlKTtcclxuICAgIH1cclxuICAgIGd0YWdDb3JlKFwiY29uZmlnXCIgLyogQ09ORklHICovLCBtZWFzdXJlbWVudElkLCBndGFnUGFyYW1zKTtcclxufVxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGxvZ2ljIHdoZW4gZ3RhZyBpcyBjYWxsZWQgd2l0aCAnZXZlbnQnIGNvbW1hbmQuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBCYXNpYyBndGFnIGZ1bmN0aW9uIHRoYXQganVzdCBhcHBlbmRzIHRvIGRhdGFMYXllci5cclxuICogQHBhcmFtIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAgTWFwIG9mIGFwcElkcyB0byB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgZHluYW1pYyBjb25maWcgZmV0Y2ggcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBtZWFzdXJlbWVudElkIEdBIE1lYXN1cmVtZW50IElEIHRvIGxvZyBldmVudCB0by5cclxuICogQHBhcmFtIGd0YWdQYXJhbXMgUGFyYW1zIHRvIGxvZyB3aXRoIHRoaXMgZXZlbnQuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBndGFnT25FdmVudChndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZCwgZ3RhZ1BhcmFtcykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvciA9IFtdO1xyXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSAnc2VuZF90bycgcGFyYW0sIGNoZWNrIGlmIGFueSBJRCBzcGVjaWZpZWQgbWF0Y2hlc1xyXG4gICAgICAgIC8vIGFuIGluaXRpYWxpemVJZHMoKSBwcm9taXNlIHdlIGFyZSB3YWl0aW5nIGZvci5cclxuICAgICAgICBpZiAoZ3RhZ1BhcmFtcyAmJiBndGFnUGFyYW1zWydzZW5kX3RvJ10pIHtcclxuICAgICAgICAgICAgbGV0IGdhU2VuZFRvTGlzdCA9IGd0YWdQYXJhbXNbJ3NlbmRfdG8nXTtcclxuICAgICAgICAgICAgLy8gTWFrZSBpdCBhbiBhcnJheSBpZiBpcyBpc24ndCwgc28gaXQgY2FuIGJlIGRlYWx0IHdpdGggdGhlIHNhbWUgd2F5LlxyXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZ2FTZW5kVG9MaXN0KSkge1xyXG4gICAgICAgICAgICAgICAgZ2FTZW5kVG9MaXN0ID0gW2dhU2VuZFRvTGlzdF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgJ3NlbmRfdG8nIGZpZWxkcyByZXF1aXJlcyBoYXZpbmcgYWxsIG1lYXN1cmVtZW50IElEIHJlc3VsdHMgYmFjayBmcm9tXHJcbiAgICAgICAgICAgIC8vIHRoZSBkeW5hbWljIGNvbmZpZyBmZXRjaC5cclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY0NvbmZpZ1Jlc3VsdHMgPSBhd2FpdCBwcm9taXNlQWxsU2V0dGxlZChkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0KTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZW5kVG9JZCBvZiBnYVNlbmRUb0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFueSBmZXRjaGVkIGR5bmFtaWMgbWVhc3VyZW1lbnQgSUQgdGhhdCBtYXRjaGVzIHRoaXMgJ3NlbmRfdG8nIElEXHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZENvbmZpZyA9IGR5bmFtaWNDb25maWdSZXN1bHRzLmZpbmQoY29uZmlnID0+IGNvbmZpZy5tZWFzdXJlbWVudElkID09PSBzZW5kVG9JZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbml0aWFsaXphdGlvblByb21pc2UgPSBmb3VuZENvbmZpZyAmJiBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2ZvdW5kQ29uZmlnLmFwcElkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yLnB1c2goaW5pdGlhbGl6YXRpb25Qcm9taXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGFuIGl0ZW0gaW4gJ3NlbmRfdG8nIHRoYXQgaXMgbm90IGFzc29jaWF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAvLyBkaXJlY3RseSB3aXRoIGFuIEZJRCwgcG9zc2libHkgYSBncm91cC4gIEVtcHR5IHRoaXMgYXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXhpdCB0aGUgbG9vcCBlYXJseSwgYW5kIGxldCBpdCBnZXQgcG9wdWxhdGVkIGJlbG93LlxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgdW5wb3B1bGF0ZWQgaWYgdGhlcmUgd2FzIG5vICdzZW5kX3RvJyBmaWVsZCAsIG9yXHJcbiAgICAgICAgLy8gaWYgbm90IGFsbCBlbnRyaWVzIGluIHRoZSAnc2VuZF90bycgZmllbGQgY291bGQgYmUgbWFwcGVkIHRvXHJcbiAgICAgICAgLy8gYSBGSUQuIEluIHRoZXNlIGNhc2VzLCB3YWl0IG9uIGFsbCBwZW5kaW5nIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gICAgICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yID0gT2JqZWN0LnZhbHVlcyhpbml0aWFsaXphdGlvblByb21pc2VzTWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUnVuIGNvcmUgZ3RhZyBmdW5jdGlvbiB3aXRoIGFyZ3MgYWZ0ZXIgYWxsIHJlbGV2YW50IGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgLy8gcHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkLlxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IpO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgZm9yIGh0dHA6Ly9iLzE0MTM3MDQ0OSAtIHRoaXJkIGFyZ3VtZW50IGNhbm5vdCBiZSB1bmRlZmluZWQuXHJcbiAgICAgICAgZ3RhZ0NvcmUoXCJldmVudFwiIC8qIEVWRU5UICovLCBtZWFzdXJlbWVudElkLCBndGFnUGFyYW1zIHx8IHt9KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBXcmFwcyBhIHN0YW5kYXJkIGd0YWcgZnVuY3Rpb24gd2l0aCBleHRyYSBjb2RlIHRvIHdhaXQgZm9yIGNvbXBsZXRpb24gb2ZcclxuICogcmVsZXZhbnQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgYmVmb3JlIHNlbmRpbmcgcmVxdWVzdHMuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBCYXNpYyBndGFnIGZ1bmN0aW9uIHRoYXQganVzdCBhcHBlbmRzIHRvIGRhdGFMYXllci5cclxuICogQHBhcmFtIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAgTWFwIG9mIGFwcElkcyB0byB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgZHluYW1pYyBjb25maWcgZmV0Y2ggcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBtZWFzdXJlbWVudElkVG9BcHBJZCBNYXAgb2YgR0EgbWVhc3VyZW1lbnRJRHMgdG8gY29ycmVzcG9uZGluZyBGaXJlYmFzZSBhcHBJZC5cclxuICovXHJcbmZ1bmN0aW9uIHdyYXBHdGFnKGd0YWdDb3JlLCBcclxuLyoqXHJcbiAqIEFsbG93cyB3cmFwcGVkIGd0YWcgY2FsbHMgdG8gd2FpdCBvbiB3aGljaGV2ZXIgaW50aWFsaXphdGlvbiBwcm9taXNlcyBhcmUgcmVxdWlyZWQsXHJcbiAqIGRlcGVuZGluZyBvbiB0aGUgY29udGVudHMgb2YgdGhlIGd0YWcgcGFyYW1zJyBgc2VuZF90b2AgZmllbGQsIGlmIGFueS5cclxuICovXHJcbmluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIFxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGNhbGxzIHNvbWV0aW1lcyByZXF1aXJlIGFsbCBkeW5hbWljIGNvbmZpZyBmZXRjaGVzIHRvIGhhdmUgcmV0dXJuZWRcclxuICogYmVmb3JlIGRldGVybWluaW5nIHdoYXQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgKHdoaWNoIGluY2x1ZGUgRklEcykgdG8gd2FpdCBmb3IuXHJcbiAqL1xyXG5keW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBcclxuLyoqXHJcbiAqIFdyYXBwZWQgZ3RhZyBjb25maWcgY2FsbHMgY2FuIG5hcnJvdyBkb3duIHdoaWNoIGluaXRpYWxpemF0aW9uIHByb21pc2UgKHdpdGggRklEKVxyXG4gKiB0byB3YWl0IGZvciBpZiB0aGUgbWVhc3VyZW1lbnRJZCBpcyBhbHJlYWR5IGZldGNoZWQsIGJ5IGdldHRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXBwSWQsXHJcbiAqIHdoaWNoIGlzIHRoZSBrZXkgZm9yIHRoZSBpbml0aWFsaXphdGlvbiBwcm9taXNlcyBtYXAuXHJcbiAqL1xyXG5tZWFzdXJlbWVudElkVG9BcHBJZCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBXcmFwcGVyIGFyb3VuZCBndGFnIHRoYXQgZW5zdXJlcyBGSUQgaXMgc2VudCB3aXRoIGd0YWcgY2FsbHMuXHJcbiAgICAgKiBAcGFyYW0gY29tbWFuZCBHdGFnIGNvbW1hbmQgdHlwZS5cclxuICAgICAqIEBwYXJhbSBpZE9yTmFtZU9yUGFyYW1zIE1lYXN1cmVtZW50IElEIGlmIGNvbW1hbmQgaXMgRVZFTlQvQ09ORklHLCBwYXJhbXMgaWYgY29tbWFuZCBpcyBTRVQuXHJcbiAgICAgKiBAcGFyYW0gZ3RhZ1BhcmFtcyBQYXJhbXMgaWYgZXZlbnQgaXMgRVZFTlQvQ09ORklHLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBmdW5jdGlvbiBndGFnV3JhcHBlcihjb21tYW5kLCBpZE9yTmFtZU9yUGFyYW1zLCBndGFnUGFyYW1zKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gSWYgZXZlbnQsIGNoZWNrIHRoYXQgcmVsZXZhbnQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgaGF2ZSBjb21wbGV0ZWQuXHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09PSBcImV2ZW50XCIgLyogRVZFTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIEVWRU5ULCBzZWNvbmQgYXJnIG11c3QgYmUgbWVhc3VyZW1lbnRJZC5cclxuICAgICAgICAgICAgICAgIGF3YWl0IGd0YWdPbkV2ZW50KGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBpZE9yTmFtZU9yUGFyYW1zLCBndGFnUGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kID09PSBcImNvbmZpZ1wiIC8qIENPTkZJRyAqLykge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgQ09ORklHLCBzZWNvbmQgYXJnIG11c3QgYmUgbWVhc3VyZW1lbnRJZC5cclxuICAgICAgICAgICAgICAgIGF3YWl0IGd0YWdPbkNvbmZpZyhndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGlkT3JOYW1lT3JQYXJhbXMsIGd0YWdQYXJhbXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbW1hbmQgPT09IFwiY29uc2VudFwiIC8qIENPTlNFTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgIC8vIElmIENPTkZJRywgc2Vjb25kIGFyZyBtdXN0IGJlIG1lYXN1cmVtZW50SWQuXHJcbiAgICAgICAgICAgICAgICBndGFnQ29yZShcImNvbnNlbnRcIiAvKiBDT05TRU5UICovLCAndXBkYXRlJywgZ3RhZ1BhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBTRVQsIHNlY29uZCBhcmcgbXVzdCBiZSBwYXJhbXMuXHJcbiAgICAgICAgICAgICAgICBndGFnQ29yZShcInNldFwiIC8qIFNFVCAqLywgaWRPck5hbWVPclBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBndGFnV3JhcHBlcjtcclxufVxyXG4vKipcclxuICogQ3JlYXRlcyBnbG9iYWwgZ3RhZyBmdW5jdGlvbiBvciB3cmFwcyBleGlzdGluZyBvbmUgaWYgZm91bmQuXHJcbiAqIFRoaXMgd3JhcHBlZCBmdW5jdGlvbiBhdHRhY2hlcyBGaXJlYmFzZSBpbnN0YW5jZSBJRCAoRklEKSB0byBndGFnICdjb25maWcnIGFuZFxyXG4gKiAnZXZlbnQnIGNhbGxzIHRoYXQgYmVsb25nIHRvIHRoZSBHQUlEIGFzc29jaWF0ZWQgd2l0aCB0aGlzIEZpcmViYXNlIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcGFyYW0gaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCBNYXAgb2YgYXBwSWRzIHRvIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCBBcnJheSBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcCBvZiBHQSBtZWFzdXJlbWVudElEcyB0byBjb3JyZXNwb25kaW5nIEZpcmViYXNlIGFwcElkLlxyXG4gKiBAcGFyYW0gZGF0YUxheWVyTmFtZSBOYW1lIG9mIGdsb2JhbCBHQSBkYXRhbGF5ZXIgYXJyYXkuXHJcbiAqIEBwYXJhbSBndGFnRnVuY3Rpb25OYW1lIE5hbWUgb2YgZ2xvYmFsIGd0YWcgZnVuY3Rpb24gKFwiZ3RhZ1wiIGlmIG5vdCB1c2VyLXNwZWNpZmllZCkuXHJcbiAqL1xyXG5mdW5jdGlvbiB3cmFwT3JDcmVhdGVHdGFnKGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIG1lYXN1cmVtZW50SWRUb0FwcElkLCBkYXRhTGF5ZXJOYW1lLCBndGFnRnVuY3Rpb25OYW1lKSB7XHJcbiAgICAvLyBDcmVhdGUgYSBiYXNpYyBjb3JlIGd0YWcgZnVuY3Rpb25cclxuICAgIGxldCBndGFnQ29yZSA9IGZ1bmN0aW9uICguLi5fYXJncykge1xyXG4gICAgICAgIC8vIE11c3QgcHVzaCBJQXJndW1lbnRzIG9iamVjdCwgbm90IGFuIGFycmF5LlxyXG4gICAgICAgIHdpbmRvd1tkYXRhTGF5ZXJOYW1lXS5wdXNoKGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG4gICAgLy8gUmVwbGFjZSBpdCB3aXRoIGV4aXN0aW5nIG9uZSBpZiBmb3VuZFxyXG4gICAgaWYgKHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXSAmJlxyXG4gICAgICAgIHR5cGVvZiB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZ3RhZ0NvcmUgPSB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV07XHJcbiAgICB9XHJcbiAgICB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV0gPSB3cmFwR3RhZyhndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBndGFnQ29yZSxcclxuICAgICAgICB3cmFwcGVkR3RhZzogd2luZG93W2d0YWdGdW5jdGlvbk5hbWVdXHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRoZSBzY3JpcHQgdGFnIGluIHRoZSBET00gbWF0Y2hpbmcgYm90aCB0aGUgZ3RhZyB1cmwgcGF0dGVyblxyXG4gKiBhbmQgdGhlIHByb3ZpZGVkIGRhdGEgbGF5ZXIgbmFtZS5cclxuICovXHJcbmZ1bmN0aW9uIGZpbmRHdGFnU2NyaXB0T25QYWdlKGRhdGFMYXllck5hbWUpIHtcclxuICAgIGNvbnN0IHNjcmlwdFRhZ3MgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpO1xyXG4gICAgZm9yIChjb25zdCB0YWcgb2YgT2JqZWN0LnZhbHVlcyhzY3JpcHRUYWdzKSkge1xyXG4gICAgICAgIGlmICh0YWcuc3JjICYmXHJcbiAgICAgICAgICAgIHRhZy5zcmMuaW5jbHVkZXMoR1RBR19VUkwpICYmXHJcbiAgICAgICAgICAgIHRhZy5zcmMuaW5jbHVkZXMoZGF0YUxheWVyTmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBFUlJPUlMgPSB7XHJcbiAgICBbXCJhbHJlYWR5LWV4aXN0c1wiIC8qIEFMUkVBRFlfRVhJU1RTICovXTogJ0EgRmlyZWJhc2UgQW5hbHl0aWNzIGluc3RhbmNlIHdpdGggdGhlIGFwcElkIHskaWR9ICcgK1xyXG4gICAgICAgICcgYWxyZWFkeSBleGlzdHMuICcgK1xyXG4gICAgICAgICdPbmx5IG9uZSBGaXJlYmFzZSBBbmFseXRpY3MgaW5zdGFuY2UgY2FuIGJlIGNyZWF0ZWQgZm9yIGVhY2ggYXBwSWQuJyxcclxuICAgIFtcImFscmVhZHktaW5pdGlhbGl6ZWRcIiAvKiBBTFJFQURZX0lOSVRJQUxJWkVEICovXTogJ2luaXRpYWxpemVBbmFseXRpY3MoKSBjYW5ub3QgYmUgY2FsbGVkIGFnYWluIHdpdGggZGlmZmVyZW50IG9wdGlvbnMgdGhhbiB0aG9zZSAnICtcclxuICAgICAgICAnaXQgd2FzIGluaXRpYWxseSBjYWxsZWQgd2l0aC4gSXQgY2FuIGJlIGNhbGxlZCBhZ2FpbiB3aXRoIHRoZSBzYW1lIG9wdGlvbnMgdG8gJyArXHJcbiAgICAgICAgJ3JldHVybiB0aGUgZXhpc3RpbmcgaW5zdGFuY2UsIG9yIGdldEFuYWx5dGljcygpIGNhbiBiZSB1c2VkICcgK1xyXG4gICAgICAgICd0byBnZXQgYSByZWZlcmVuY2UgdG8gdGhlIGFscmVhZHktaW50aWFsaXplZCBpbnN0YW5jZS4nLFxyXG4gICAgW1wiYWxyZWFkeS1pbml0aWFsaXplZC1zZXR0aW5nc1wiIC8qIEFMUkVBRFlfSU5JVElBTElaRURfU0VUVElOR1MgKi9dOiAnRmlyZWJhc2UgQW5hbHl0aWNzIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWQuJyArXHJcbiAgICAgICAgJ3NldHRpbmdzKCkgbXVzdCBiZSBjYWxsZWQgYmVmb3JlIGluaXRpYWxpemluZyBhbnkgQW5hbHl0aWNzIGluc3RhbmNlJyArXHJcbiAgICAgICAgJ29yIGl0IHdpbGwgaGF2ZSBubyBlZmZlY3QuJyxcclxuICAgIFtcImludGVyb3AtY29tcG9uZW50LXJlZy1mYWlsZWRcIiAvKiBJTlRFUk9QX0NPTVBPTkVOVF9SRUdfRkFJTEVEICovXTogJ0ZpcmViYXNlIEFuYWx5dGljcyBJbnRlcm9wIENvbXBvbmVudCBmYWlsZWQgdG8gaW5zdGFudGlhdGU6IHskcmVhc29ufScsXHJcbiAgICBbXCJpbnZhbGlkLWFuYWx5dGljcy1jb250ZXh0XCIgLyogSU5WQUxJRF9BTkFMWVRJQ1NfQ09OVEVYVCAqL106ICdGaXJlYmFzZSBBbmFseXRpY3MgaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGVudmlyb25tZW50LiAnICtcclxuICAgICAgICAnV3JhcCBpbml0aWFsaXphdGlvbiBvZiBhbmFseXRpY3MgaW4gYW5hbHl0aWNzLmlzU3VwcG9ydGVkKCkgJyArXHJcbiAgICAgICAgJ3RvIHByZXZlbnQgaW5pdGlhbGl6YXRpb24gaW4gdW5zdXBwb3J0ZWQgZW52aXJvbm1lbnRzLiBEZXRhaWxzOiB7JGVycm9ySW5mb30nLFxyXG4gICAgW1wiaW5kZXhlZGRiLXVuYXZhaWxhYmxlXCIgLyogSU5ERVhFRERCX1VOQVZBSUxBQkxFICovXTogJ0luZGV4ZWREQiB1bmF2YWlsYWJsZSBvciByZXN0cmljdGVkIGluIHRoaXMgZW52aXJvbm1lbnQuICcgK1xyXG4gICAgICAgICdXcmFwIGluaXRpYWxpemF0aW9uIG9mIGFuYWx5dGljcyBpbiBhbmFseXRpY3MuaXNTdXBwb3J0ZWQoKSAnICtcclxuICAgICAgICAndG8gcHJldmVudCBpbml0aWFsaXphdGlvbiBpbiB1bnN1cHBvcnRlZCBlbnZpcm9ubWVudHMuIERldGFpbHM6IHskZXJyb3JJbmZvfScsXHJcbiAgICBbXCJmZXRjaC10aHJvdHRsZVwiIC8qIEZFVENIX1RIUk9UVExFICovXTogJ1RoZSBjb25maWcgZmV0Y2ggcmVxdWVzdCB0aW1lZCBvdXQgd2hpbGUgaW4gYW4gZXhwb25lbnRpYWwgYmFja29mZiBzdGF0ZS4nICtcclxuICAgICAgICAnIFVuaXggdGltZXN0YW1wIGluIG1pbGxpc2Vjb25kcyB3aGVuIGZldGNoIHJlcXVlc3QgdGhyb3R0bGluZyBlbmRzOiB7JHRocm90dGxlRW5kVGltZU1pbGxpc30uJyxcclxuICAgIFtcImNvbmZpZy1mZXRjaC1mYWlsZWRcIiAvKiBDT05GSUdfRkVUQ0hfRkFJTEVEICovXTogJ0R5bmFtaWMgY29uZmlnIGZldGNoIGZhaWxlZDogW3skaHR0cFN0YXR1c31dIHskcmVzcG9uc2VNZXNzYWdlfScsXHJcbiAgICBbXCJuby1hcGkta2V5XCIgLyogTk9fQVBJX0tFWSAqL106ICdUaGUgXCJhcGlLZXlcIiBmaWVsZCBpcyBlbXB0eSBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnLiBGaXJlYmFzZSBBbmFseXRpY3MgcmVxdWlyZXMgdGhpcyBmaWVsZCB0bycgK1xyXG4gICAgICAgICdjb250YWluIGEgdmFsaWQgQVBJIGtleS4nLFxyXG4gICAgW1wibm8tYXBwLWlkXCIgLyogTk9fQVBQX0lEICovXTogJ1RoZSBcImFwcElkXCIgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gRmlyZWJhc2UgQW5hbHl0aWNzIHJlcXVpcmVzIHRoaXMgZmllbGQgdG8nICtcclxuICAgICAgICAnY29udGFpbiBhIHZhbGlkIGFwcCBJRC4nXHJcbn07XHJcbmNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5KCdhbmFseXRpY3MnLCAnQW5hbHl0aWNzJywgRVJST1JTKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEJhY2tvZmYgZmFjdG9yIGZvciA1MDMgZXJyb3JzLCB3aGljaCB3ZSB3YW50IHRvIGJlIGNvbnNlcnZhdGl2ZSBhYm91dFxyXG4gKiB0byBhdm9pZCBvdmVybG9hZGluZyBzZXJ2ZXJzLiBFYWNoIHJldHJ5IGludGVydmFsIHdpbGwgYmVcclxuICogQkFTRV9JTlRFUlZBTF9NSUxMSVMgKiBMT05HX1JFVFJZX0ZBQ1RPUiBeIHJldHJ5Q291bnQsIHNvIHRoZSBzZWNvbmQgb25lXHJcbiAqIHdpbGwgYmUgfjMwIHNlY29uZHMgKHdpdGggZnV6emluZykuXHJcbiAqL1xyXG5jb25zdCBMT05HX1JFVFJZX0ZBQ1RPUiA9IDMwO1xyXG4vKipcclxuICogQmFzZSB3YWl0IGludGVydmFsIHRvIG11bHRpcGxpZWQgYnkgYmFja29mZkZhY3Rvcl5iYWNrb2ZmQ291bnQuXHJcbiAqL1xyXG5jb25zdCBCQVNFX0lOVEVSVkFMX01JTExJUyA9IDEwMDA7XHJcbi8qKlxyXG4gKiBTdHViYmFibGUgcmV0cnkgZGF0YSBzdG9yYWdlIGNsYXNzLlxyXG4gKi9cclxuY2xhc3MgUmV0cnlEYXRhIHtcclxuICAgIGNvbnN0cnVjdG9yKHRocm90dGxlTWV0YWRhdGEgPSB7fSwgaW50ZXJ2YWxNaWxsaXMgPSBCQVNFX0lOVEVSVkFMX01JTExJUykge1xyXG4gICAgICAgIHRoaXMudGhyb3R0bGVNZXRhZGF0YSA9IHRocm90dGxlTWV0YWRhdGE7XHJcbiAgICAgICAgdGhpcy5pbnRlcnZhbE1pbGxpcyA9IGludGVydmFsTWlsbGlzO1xyXG4gICAgfVxyXG4gICAgZ2V0VGhyb3R0bGVNZXRhZGF0YShhcHBJZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRocm90dGxlTWV0YWRhdGFbYXBwSWRdO1xyXG4gICAgfVxyXG4gICAgc2V0VGhyb3R0bGVNZXRhZGF0YShhcHBJZCwgbWV0YWRhdGEpIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlTWV0YWRhdGFbYXBwSWRdID0gbWV0YWRhdGE7XHJcbiAgICB9XHJcbiAgICBkZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMudGhyb3R0bGVNZXRhZGF0YVthcHBJZF07XHJcbiAgICB9XHJcbn1cclxuY29uc3QgZGVmYXVsdFJldHJ5RGF0YSA9IG5ldyBSZXRyeURhdGEoKTtcclxuLyoqXHJcbiAqIFNldCBHRVQgcmVxdWVzdCBoZWFkZXJzLlxyXG4gKiBAcGFyYW0gYXBpS2V5IEFwcCBBUEkga2V5LlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SGVhZGVycyhhcGlLZXkpIHtcclxuICAgIHJldHVybiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgQWNjZXB0OiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ3gtZ29vZy1hcGkta2V5JzogYXBpS2V5XHJcbiAgICB9KTtcclxufVxyXG4vKipcclxuICogRmV0Y2hlcyBkeW5hbWljIGNvbmZpZyBmcm9tIGJhY2tlbmQuXHJcbiAqIEBwYXJhbSBhcHAgRmlyZWJhc2UgYXBwIHRvIGZldGNoIGNvbmZpZyBmb3IuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBmZXRjaER5bmFtaWNDb25maWcoYXBwRmllbGRzKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBjb25zdCB7IGFwcElkLCBhcGlLZXkgfSA9IGFwcEZpZWxkcztcclxuICAgIGNvbnN0IHJlcXVlc3QgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBoZWFkZXJzOiBnZXRIZWFkZXJzKGFwaUtleSlcclxuICAgIH07XHJcbiAgICBjb25zdCBhcHBVcmwgPSBEWU5BTUlDX0NPTkZJR19VUkwucmVwbGFjZSgne2FwcC1pZH0nLCBhcHBJZCk7XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGFwcFVybCwgcmVxdWVzdCk7XHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzICE9PSAzMDQpIHtcclxuICAgICAgICBsZXQgZXJyb3JNZXNzYWdlID0gJyc7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gVHJ5IHRvIGdldCBhbnkgZXJyb3IgbWVzc2FnZSB0ZXh0IGZyb20gc2VydmVyIHJlc3BvbnNlLlxyXG4gICAgICAgICAgICBjb25zdCBqc29uUmVzcG9uc2UgPSAoYXdhaXQgcmVzcG9uc2UuanNvbigpKTtcclxuICAgICAgICAgICAgaWYgKChfYSA9IGpzb25SZXNwb25zZS5lcnJvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IGpzb25SZXNwb25zZS5lcnJvci5tZXNzYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChfaWdub3JlZCkgeyB9XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJjb25maWctZmV0Y2gtZmFpbGVkXCIgLyogQ09ORklHX0ZFVENIX0ZBSUxFRCAqLywge1xyXG4gICAgICAgICAgICBodHRwU3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlTWVzc2FnZTogZXJyb3JNZXNzYWdlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG59XHJcbi8qKlxyXG4gKiBGZXRjaGVzIGR5bmFtaWMgY29uZmlnIGZyb20gYmFja2VuZCwgcmV0cnlpbmcgaWYgZmFpbGVkLlxyXG4gKiBAcGFyYW0gYXBwIEZpcmViYXNlIGFwcCB0byBmZXRjaCBjb25maWcgZm9yLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5KGFwcCwgXHJcbi8vIHJldHJ5RGF0YSBhbmQgdGltZW91dE1pbGxpcyBhcmUgcGFyYW1ldGVyaXplZCB0byBhbGxvdyBwYXNzaW5nIGEgZGlmZmVyZW50IHZhbHVlIGZvciB0ZXN0aW5nLlxyXG5yZXRyeURhdGEgPSBkZWZhdWx0UmV0cnlEYXRhLCB0aW1lb3V0TWlsbGlzKSB7XHJcbiAgICBjb25zdCB7IGFwcElkLCBhcGlLZXksIG1lYXN1cmVtZW50SWQgfSA9IGFwcC5vcHRpb25zO1xyXG4gICAgaWYgKCFhcHBJZCkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBwLWlkXCIgLyogTk9fQVBQX0lEICovKTtcclxuICAgIH1cclxuICAgIGlmICghYXBpS2V5KSB7XHJcbiAgICAgICAgaWYgKG1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG1lYXN1cmVtZW50SWQsXHJcbiAgICAgICAgICAgICAgICBhcHBJZFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwaS1rZXlcIiAvKiBOT19BUElfS0VZICovKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHRocm90dGxlTWV0YWRhdGEgPSByZXRyeURhdGEuZ2V0VGhyb3R0bGVNZXRhZGF0YShhcHBJZCkgfHwge1xyXG4gICAgICAgIGJhY2tvZmZDb3VudDogMCxcclxuICAgICAgICB0aHJvdHRsZUVuZFRpbWVNaWxsaXM6IERhdGUubm93KClcclxuICAgIH07XHJcbiAgICBjb25zdCBzaWduYWwgPSBuZXcgQW5hbHl0aWNzQWJvcnRTaWduYWwoKTtcclxuICAgIHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8vIE5vdGUgYSB2ZXJ5IGxvdyBkZWxheSwgZWcgPCAxMG1zLCBjYW4gZWxhcHNlIGJlZm9yZSBsaXN0ZW5lcnMgYXJlIGluaXRpYWxpemVkLlxyXG4gICAgICAgIHNpZ25hbC5hYm9ydCgpO1xyXG4gICAgfSwgdGltZW91dE1pbGxpcyAhPT0gdW5kZWZpbmVkID8gdGltZW91dE1pbGxpcyA6IEZFVENIX1RJTUVPVVRfTUlMTElTKTtcclxuICAgIHJldHVybiBhdHRlbXB0RmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5KHsgYXBwSWQsIGFwaUtleSwgbWVhc3VyZW1lbnRJZCB9LCB0aHJvdHRsZU1ldGFkYXRhLCBzaWduYWwsIHJldHJ5RGF0YSk7XHJcbn1cclxuLyoqXHJcbiAqIFJ1bnMgb25lIHJldHJ5IGF0dGVtcHQuXHJcbiAqIEBwYXJhbSBhcHBGaWVsZHMgTmVjZXNzYXJ5IGFwcCBjb25maWcgZmllbGRzLlxyXG4gKiBAcGFyYW0gdGhyb3R0bGVNZXRhZGF0YSBPbmdvaW5nIG1ldGFkYXRhIHRvIGRldGVybWluZSB0aHJvdHRsaW5nIHRpbWVzLlxyXG4gKiBAcGFyYW0gc2lnbmFsIEFib3J0IHNpZ25hbC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkoYXBwRmllbGRzLCB7IHRocm90dGxlRW5kVGltZU1pbGxpcywgYmFja29mZkNvdW50IH0sIHNpZ25hbCwgcmV0cnlEYXRhID0gZGVmYXVsdFJldHJ5RGF0YSAvLyBmb3IgdGVzdGluZ1xyXG4pIHtcclxuICAgIHZhciBfYSwgX2I7XHJcbiAgICBjb25zdCB7IGFwcElkLCBtZWFzdXJlbWVudElkIH0gPSBhcHBGaWVsZHM7XHJcbiAgICAvLyBTdGFydHMgd2l0aCBhIChwb3RlbnRpYWxseSB6ZXJvKSB0aW1lb3V0IHRvIHN1cHBvcnQgcmVzdW1wdGlvbiBmcm9tIHN0b3JlZCBzdGF0ZS5cclxuICAgIC8vIEVuc3VyZXMgdGhlIHRocm90dGxlIGVuZCB0aW1lIGlzIGhvbm9yZWQgaWYgdGhlIGxhc3QgYXR0ZW1wdCB0aW1lZCBvdXQuXHJcbiAgICAvLyBOb3RlIHRoZSBTREsgd2lsbCBuZXZlciBtYWtlIGEgcmVxdWVzdCBpZiB0aGUgZmV0Y2ggdGltZW91dCBleHBpcmVzIGF0IHRoaXMgcG9pbnQuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHNldEFib3J0YWJsZVRpbWVvdXQoc2lnbmFsLCB0aHJvdHRsZUVuZFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAobWVhc3VyZW1lbnRJZCkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihgVGltZWQgb3V0IGZldGNoaW5nIHRoaXMgRmlyZWJhc2UgYXBwJ3MgbWVhc3VyZW1lbnQgSUQgZnJvbSB0aGUgc2VydmVyLmAgK1xyXG4gICAgICAgICAgICAgICAgYCBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7bWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgIGAgcHJvdmlkZWQgaW4gdGhlIFwibWVhc3VyZW1lbnRJZFwiIGZpZWxkIGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIFskeyhfYSA9IGUpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlfV1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYXBwSWQsIG1lYXN1cmVtZW50SWQgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaER5bmFtaWNDb25maWcoYXBwRmllbGRzKTtcclxuICAgICAgICAvLyBOb3RlIHRoZSBTREsgb25seSBjbGVhcnMgdGhyb3R0bGUgc3RhdGUgaWYgcmVzcG9uc2UgaXMgc3VjY2VzcyBvciBub24tcmV0cmlhYmxlLlxyXG4gICAgICAgIHJldHJ5RGF0YS5kZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKTtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gZTtcclxuICAgICAgICBpZiAoIWlzUmV0cmlhYmxlRXJyb3IoZXJyb3IpKSB7XHJcbiAgICAgICAgICAgIHJldHJ5RGF0YS5kZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKTtcclxuICAgICAgICAgICAgaWYgKG1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBGYWlsZWQgdG8gZmV0Y2ggdGhpcyBGaXJlYmFzZSBhcHAncyBtZWFzdXJlbWVudCBJRCBmcm9tIHRoZSBzZXJ2ZXIuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYCBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7bWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgICAgICBgIHByb3ZpZGVkIGluIHRoZSBcIm1lYXN1cmVtZW50SWRcIiBmaWVsZCBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnLiBbJHtlcnJvciA9PT0gbnVsbCB8fCBlcnJvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyb3IubWVzc2FnZX1dYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBhcHBJZCwgbWVhc3VyZW1lbnRJZCB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBiYWNrb2ZmTWlsbGlzID0gTnVtYmVyKChfYiA9IGVycm9yID09PSBudWxsIHx8IGVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlcnJvci5jdXN0b21EYXRhKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuaHR0cFN0YXR1cykgPT09IDUwM1xyXG4gICAgICAgICAgICA/IGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCByZXRyeURhdGEuaW50ZXJ2YWxNaWxsaXMsIExPTkdfUkVUUllfRkFDVE9SKVxyXG4gICAgICAgICAgICA6IGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCByZXRyeURhdGEuaW50ZXJ2YWxNaWxsaXMpO1xyXG4gICAgICAgIC8vIEluY3JlbWVudHMgYmFja29mZiBzdGF0ZS5cclxuICAgICAgICBjb25zdCB0aHJvdHRsZU1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICB0aHJvdHRsZUVuZFRpbWVNaWxsaXM6IERhdGUubm93KCkgKyBiYWNrb2ZmTWlsbGlzLFxyXG4gICAgICAgICAgICBiYWNrb2ZmQ291bnQ6IGJhY2tvZmZDb3VudCArIDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFBlcnNpc3RzIHN0YXRlLlxyXG4gICAgICAgIHJldHJ5RGF0YS5zZXRUaHJvdHRsZU1ldGFkYXRhKGFwcElkLCB0aHJvdHRsZU1ldGFkYXRhKTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYENhbGxpbmcgYXR0ZW1wdEZldGNoIGFnYWluIGluICR7YmFja29mZk1pbGxpc30gbWlsbGlzYCk7XHJcbiAgICAgICAgcmV0dXJuIGF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkoYXBwRmllbGRzLCB0aHJvdHRsZU1ldGFkYXRhLCBzaWduYWwsIHJldHJ5RGF0YSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFN1cHBvcnRzIHdhaXRpbmcgb24gYSBiYWNrb2ZmIGJ5OlxyXG4gKlxyXG4gKiA8dWw+XHJcbiAqICAgPGxpPlByb21pc2lmeWluZyBzZXRUaW1lb3V0LCBzbyB3ZSBjYW4gc2V0IGEgdGltZW91dCBpbiBvdXIgUHJvbWlzZSBjaGFpbjwvbGk+XHJcbiAqICAgPGxpPkxpc3RlbmluZyBvbiBhIHNpZ25hbCBidXMgZm9yIGFib3J0IGV2ZW50cywganVzdCBsaWtlIHRoZSBGZXRjaCBBUEk8L2xpPlxyXG4gKiAgIDxsaT5GYWlsaW5nIGluIHRoZSBzYW1lIHdheSB0aGUgRmV0Y2ggQVBJIGZhaWxzLCBzbyB0aW1pbmcgb3V0IGEgbGl2ZSByZXF1ZXN0IGFuZCBhIHRocm90dGxlZFxyXG4gKiAgICAgICByZXF1ZXN0IGFwcGVhciB0aGUgc2FtZS48L2xpPlxyXG4gKiA8L3VsPlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QWJvcnRhYmxlVGltZW91dChzaWduYWwsIHRocm90dGxlRW5kVGltZU1pbGxpcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAvLyBEZXJpdmVzIGJhY2tvZmYgZnJvbSBnaXZlbiBlbmQgdGltZSwgbm9ybWFsaXppbmcgbmVnYXRpdmUgbnVtYmVycyB0byB6ZXJvLlxyXG4gICAgICAgIGNvbnN0IGJhY2tvZmZNaWxsaXMgPSBNYXRoLm1heCh0aHJvdHRsZUVuZFRpbWVNaWxsaXMgLSBEYXRlLm5vdygpLCAwKTtcclxuICAgICAgICBjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dChyZXNvbHZlLCBiYWNrb2ZmTWlsbGlzKTtcclxuICAgICAgICAvLyBBZGRzIGxpc3RlbmVyLCByYXRoZXIgdGhhbiBzZXRzIG9uYWJvcnQsIGJlY2F1c2Ugc2lnbmFsIGlzIGEgc2hhcmVkIG9iamVjdC5cclxuICAgICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIHJlcXVlc3QgY29tcGxldGVzIGJlZm9yZSB0aGlzIHRpbWVvdXQsIHRoZSByZWplY3Rpb24gaGFzIG5vIGVmZmVjdC5cclxuICAgICAgICAgICAgcmVqZWN0KEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZmV0Y2gtdGhyb3R0bGVcIiAvKiBGRVRDSF9USFJPVFRMRSAqLywge1xyXG4gICAgICAgICAgICAgICAgdGhyb3R0bGVFbmRUaW1lTWlsbGlzXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHtAbGluayBFcnJvcn0gaW5kaWNhdGVzIGEgZmV0Y2ggcmVxdWVzdCBtYXkgc3VjY2VlZCBsYXRlci5cclxuICovXHJcbmZ1bmN0aW9uIGlzUmV0cmlhYmxlRXJyb3IoZSkge1xyXG4gICAgaWYgKCEoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHx8ICFlLmN1c3RvbURhdGEpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBVc2VzIHN0cmluZyBpbmRleCBkZWZpbmVkIGJ5IEVycm9yRGF0YSwgd2hpY2ggRmlyZWJhc2VFcnJvciBpbXBsZW1lbnRzLlxyXG4gICAgY29uc3QgaHR0cFN0YXR1cyA9IE51bWJlcihlLmN1c3RvbURhdGFbJ2h0dHBTdGF0dXMnXSk7XHJcbiAgICByZXR1cm4gKGh0dHBTdGF0dXMgPT09IDQyOSB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwMCB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwMyB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwNCk7XHJcbn1cclxuLyoqXHJcbiAqIFNoaW1zIGEgbWluaW1hbCBBYm9ydFNpZ25hbCAoY29waWVkIGZyb20gUmVtb3RlIENvbmZpZykuXHJcbiAqXHJcbiAqIDxwPkFib3J0Q29udHJvbGxlcidzIEFib3J0U2lnbmFsIGNvbnZlbmllbnRseSBkZWNvdXBsZXMgZmV0Y2ggdGltZW91dCBsb2dpYyBmcm9tIG90aGVyIGFzcGVjdHNcclxuICogb2YgbmV0d29ya2luZywgc3VjaCBhcyByZXRyaWVzLiBGaXJlYmFzZSBkb2Vzbid0IHVzZSBBYm9ydENvbnRyb2xsZXIgZW5vdWdoIHRvIGp1c3RpZnkgYVxyXG4gKiBwb2x5ZmlsbCByZWNvbW1lbmRhdGlvbiwgbGlrZSB3ZSBkbyB3aXRoIHRoZSBGZXRjaCBBUEksIGJ1dCB0aGlzIG1pbmltYWwgc2hpbSBjYW4gZWFzaWx5IGJlXHJcbiAqIHN3YXBwZWQgb3V0IGlmL3doZW4gd2UgZG8uXHJcbiAqL1xyXG5jbGFzcyBBbmFseXRpY3NBYm9ydFNpZ25hbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcikge1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgYWJvcnQoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lcigpKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRXZlbnQgcGFyYW1ldGVycyB0byBzZXQgb24gJ2d0YWcnIGR1cmluZyBpbml0aWFsaXphdGlvbi5cclxuICovXHJcbmxldCBkZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdDtcclxuLyoqXHJcbiAqIExvZ3MgYW4gYW5hbHl0aWNzIGV2ZW50IHRocm91Z2ggdGhlIEZpcmViYXNlIFNESy5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gZXZlbnROYW1lIEdvb2dsZSBBbmFseXRpY3MgZXZlbnQgbmFtZSwgY2hvb3NlIGZyb20gc3RhbmRhcmQgbGlzdCBvciB1c2UgYSBjdXN0b20gc3RyaW5nLlxyXG4gKiBAcGFyYW0gZXZlbnRQYXJhbXMgQW5hbHl0aWNzIGV2ZW50IHBhcmFtZXRlcnMuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBsb2dFdmVudCQxKGd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdsb2JhbCkge1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImV2ZW50XCIgLyogRVZFTlQgKi8sIGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBldmVudFBhcmFtcyksIHsgJ3NlbmRfdG8nOiBtZWFzdXJlbWVudElkIH0pO1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImV2ZW50XCIgLyogRVZFTlQgKi8sIGV2ZW50TmFtZSwgcGFyYW1zKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2V0IHNjcmVlbl9uYW1lIHBhcmFtZXRlciBmb3IgdGhpcyBHb29nbGUgQW5hbHl0aWNzIElELlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIGxvZ0V2ZW50fSB3aXRoIGBldmVudE5hbWVgIGFzICdzY3JlZW5fdmlldycgYW5kIGFkZCByZWxldmFudCBgZXZlbnRQYXJhbXNgLlxyXG4gKiBTZWUge0BsaW5rIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL2FuYWx5dGljcy9zY3JlZW52aWV3cyB8IFRyYWNrIFNjcmVlbnZpZXdzfS5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gc2NyZWVuTmFtZSBTY3JlZW4gbmFtZSBzdHJpbmcgdG8gc2V0LlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gc2V0Q3VycmVudFNjcmVlbiQxKGd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBzY3JlZW5OYW1lLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdsb2JhbCkge1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcInNldFwiIC8qIFNFVCAqLywgeyAnc2NyZWVuX25hbWUnOiBzY3JlZW5OYW1lIH0pO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiY29uZmlnXCIgLyogQ09ORklHICovLCBtZWFzdXJlbWVudElkLCB7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgJ3NjcmVlbl9uYW1lJzogc2NyZWVuTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBTZXQgdXNlcl9pZCBwYXJhbWV0ZXIgZm9yIHRoaXMgR29vZ2xlIEFuYWx5dGljcyBJRC5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gaWQgVXNlciBJRCBzdHJpbmcgdG8gc2V0XHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBzZXRVc2VySWQkMShndGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZSwgaWQsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwic2V0XCIgLyogU0VUICovLCB7ICd1c2VyX2lkJzogaWQgfSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgICAgICBndGFnRnVuY3Rpb24oXCJjb25maWdcIiAvKiBDT05GSUcgKi8sIG1lYXN1cmVtZW50SWQsIHtcclxuICAgICAgICAgICAgdXBkYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAndXNlcl9pZCc6IGlkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFNldCBhbGwgb3RoZXIgdXNlciBwcm9wZXJ0aWVzIG90aGVyIHRoYW4gdXNlcl9pZCBhbmQgc2NyZWVuX25hbWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnRnVuY3Rpb24gV3JhcHBlZCBndGFnIGZ1bmN0aW9uIHRoYXQgd2FpdHMgZm9yIGZpZCB0byBiZSBzZXQgYmVmb3JlIHNlbmRpbmcgYW4gZXZlbnRcclxuICogQHBhcmFtIHByb3BlcnRpZXMgTWFwIG9mIHVzZXIgcHJvcGVydGllcyB0byBzZXRcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldFVzZXJQcm9wZXJ0aWVzJDEoZ3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2UsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgY29uc3QgZmxhdFByb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZG90IG5vdGF0aW9uIGZvciBtZXJnZSBiZWhhdmlvciBpbiBndGFnLmpzXHJcbiAgICAgICAgICAgIGZsYXRQcm9wZXJ0aWVzW2B1c2VyX3Byb3BlcnRpZXMuJHtrZXl9YF0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcInNldFwiIC8qIFNFVCAqLywgZmxhdFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiY29uZmlnXCIgLyogQ09ORklHICovLCBtZWFzdXJlbWVudElkLCB7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgJ3VzZXJfcHJvcGVydGllcyc6IHByb3BlcnRpZXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2V0IHdoZXRoZXIgY29sbGVjdGlvbiBpcyBlbmFibGVkIGZvciB0aGlzIElELlxyXG4gKlxyXG4gKiBAcGFyYW0gZW5hYmxlZCBJZiB0cnVlLCBjb2xsZWN0aW9uIGlzIGVuYWJsZWQgZm9yIHRoaXMgSUQuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBzZXRBbmFseXRpY3NDb2xsZWN0aW9uRW5hYmxlZCQxKGluaXRpYWxpemF0aW9uUHJvbWlzZSwgZW5hYmxlZCkge1xyXG4gICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgIHdpbmRvd1tgZ2EtZGlzYWJsZS0ke21lYXN1cmVtZW50SWR9YF0gPSAhZW5hYmxlZDtcclxufVxyXG4vKipcclxuICogQ29uc2VudCBwYXJhbWV0ZXJzIHRvIGRlZmF1bHQgdG8gZHVyaW5nICdndGFnJyBpbml0aWFsaXphdGlvbi5cclxuICovXHJcbmxldCBkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdDtcclxuLyoqXHJcbiAqIFNldHMgdGhlIHZhcmlhYmxlIHtAbGluayBkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdH0gZm9yIHVzZSBpbiB0aGUgaW5pdGlhbGl6YXRpb24gb2ZcclxuICogYW5hbHl0aWNzLlxyXG4gKlxyXG4gKiBAcGFyYW0gY29uc2VudFNldHRpbmdzIE1hcHMgdGhlIGFwcGxpY2FibGUgZW5kIHVzZXIgY29uc2VudCBzdGF0ZSBmb3IgZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIF9zZXRDb25zZW50RGVmYXVsdEZvckluaXQoY29uc2VudFNldHRpbmdzKSB7XHJcbiAgICBkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdCA9IGNvbnNlbnRTZXR0aW5ncztcclxufVxyXG4vKipcclxuICogU2V0cyB0aGUgdmFyaWFibGUgYGRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0YCBmb3IgdXNlIGluIHRoZSBpbml0aWFsaXphdGlvbiBvZlxyXG4gKiBhbmFseXRpY3MuXHJcbiAqXHJcbiAqIEBwYXJhbSBjdXN0b21QYXJhbXMgQW55IGN1c3RvbSBwYXJhbXMgdGhlIHVzZXIgbWF5IHBhc3MgdG8gZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIF9zZXREZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdChjdXN0b21QYXJhbXMpIHtcclxuICAgIGRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0ID0gY3VzdG9tUGFyYW1zO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlSW5kZXhlZERCKCkge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgaWYgKCFpc0luZGV4ZWREQkF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgbG9nZ2VyLndhcm4oRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbmRleGVkZGItdW5hdmFpbGFibGVcIiAvKiBJTkRFWEVEREJfVU5BVkFJTEFCTEUgKi8sIHtcclxuICAgICAgICAgICAgZXJyb3JJbmZvOiAnSW5kZXhlZERCIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBlbnZpcm9ubWVudC4nXHJcbiAgICAgICAgfSkubWVzc2FnZSk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImluZGV4ZWRkYi11bmF2YWlsYWJsZVwiIC8qIElOREVYRUREQl9VTkFWQUlMQUJMRSAqLywge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJbmZvOiAoX2EgPSBlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICB9KS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbi8qKlxyXG4gKiBJbml0aWFsaXplIHRoZSBhbmFseXRpY3MgaW5zdGFuY2UgaW4gZ3RhZy5qcyBieSBjYWxsaW5nIGNvbmZpZyBjb21tYW5kIHdpdGggZmlkLlxyXG4gKlxyXG4gKiBOT1RFOiBXZSBjb21iaW5lIGFuYWx5dGljcyBpbml0aWFsaXphdGlvbiBhbmQgc2V0dGluZyBmaWQgdG9nZXRoZXIgYmVjYXVzZSB3ZSB3YW50IGZpZCB0byBiZVxyXG4gKiBwYXJ0IG9mIHRoZSBgcGFnZV92aWV3YCBldmVudCB0aGF0J3Mgc2VudCBkdXJpbmcgdGhlIGluaXRpYWxpemF0aW9uXHJcbiAqIEBwYXJhbSBhcHAgRmlyZWJhc2UgYXBwXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBUaGUgZ3RhZyBmdW5jdGlvbiB0aGF0J3Mgbm90IHdyYXBwZWQuXHJcbiAqIEBwYXJhbSBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0IEFycmF5IG9mIGFsbCBkeW5hbWljIGNvbmZpZyBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcHMgbWVhc3VyZW1lbnRJRCB0byBhcHBJRC5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgX0ZpcmViYXNlSW5zdGFsbGF0aW9uc0ludGVybmFsIGluc3RhbmNlLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBNZWFzdXJlbWVudCBJRC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIF9pbml0aWFsaXplQW5hbHl0aWNzKGFwcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGluc3RhbGxhdGlvbnMsIGd0YWdDb3JlLCBkYXRhTGF5ZXJOYW1lLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBjb25zdCBkeW5hbWljQ29uZmlnUHJvbWlzZSA9IGZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeShhcHApO1xyXG4gICAgLy8gT25jZSBmZXRjaGVkLCBtYXAgbWVhc3VyZW1lbnRJZHMgdG8gYXBwSWQsIGZvciBlYXNlIG9mIGxvb2t1cCBpbiB3cmFwcGVkIGd0YWcgZnVuY3Rpb24uXHJcbiAgICBkeW5hbWljQ29uZmlnUHJvbWlzZVxyXG4gICAgICAgIC50aGVuKGNvbmZpZyA9PiB7XHJcbiAgICAgICAgbWVhc3VyZW1lbnRJZFRvQXBwSWRbY29uZmlnLm1lYXN1cmVtZW50SWRdID0gY29uZmlnLmFwcElkO1xyXG4gICAgICAgIGlmIChhcHAub3B0aW9ucy5tZWFzdXJlbWVudElkICYmXHJcbiAgICAgICAgICAgIGNvbmZpZy5tZWFzdXJlbWVudElkICE9PSBhcHAub3B0aW9ucy5tZWFzdXJlbWVudElkKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGBUaGUgbWVhc3VyZW1lbnQgSUQgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZyAoJHthcHAub3B0aW9ucy5tZWFzdXJlbWVudElkfSlgICtcclxuICAgICAgICAgICAgICAgIGAgZG9lcyBub3QgbWF0Y2ggdGhlIG1lYXN1cmVtZW50IElEIGZldGNoZWQgZnJvbSB0aGUgc2VydmVyICgke2NvbmZpZy5tZWFzdXJlbWVudElkfSkuYCArXHJcbiAgICAgICAgICAgICAgICBgIFRvIGVuc3VyZSBhbmFseXRpY3MgZXZlbnRzIGFyZSBhbHdheXMgc2VudCB0byB0aGUgY29ycmVjdCBBbmFseXRpY3MgcHJvcGVydHksYCArXHJcbiAgICAgICAgICAgICAgICBgIHVwZGF0ZSB0aGVgICtcclxuICAgICAgICAgICAgICAgIGAgbWVhc3VyZW1lbnQgSUQgZmllbGQgaW4gdGhlIGxvY2FsIGNvbmZpZyBvciByZW1vdmUgaXQgZnJvbSB0aGUgbG9jYWwgY29uZmlnLmApO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGUgPT4gbG9nZ2VyLmVycm9yKGUpKTtcclxuICAgIC8vIEFkZCB0byBsaXN0IHRvIHRyYWNrIHN0YXRlIG9mIGFsbCBkeW5hbWljIGNvbmZpZyBwcm9taXNlcy5cclxuICAgIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QucHVzaChkeW5hbWljQ29uZmlnUHJvbWlzZSk7XHJcbiAgICBjb25zdCBmaWRQcm9taXNlID0gdmFsaWRhdGVJbmRleGVkREIoKS50aGVuKGVudklzVmFsaWQgPT4ge1xyXG4gICAgICAgIGlmIChlbnZJc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YWxsYXRpb25zLmdldElkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgY29uc3QgW2R5bmFtaWNDb25maWcsIGZpZF0gPSBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgZHluYW1pY0NvbmZpZ1Byb21pc2UsXHJcbiAgICAgICAgZmlkUHJvbWlzZVxyXG4gICAgXSk7XHJcbiAgICAvLyBEZXRlY3QgaWYgdXNlciBoYXMgYWxyZWFkeSBwdXQgdGhlIGd0YWcgPHNjcmlwdD4gdGFnIG9uIHRoaXMgcGFnZSB3aXRoIHRoZSBwYXNzZWQgaW5cclxuICAgIC8vIGRhdGEgbGF5ZXIgbmFtZS5cclxuICAgIGlmICghZmluZEd0YWdTY3JpcHRPblBhZ2UoZGF0YUxheWVyTmFtZSkpIHtcclxuICAgICAgICBpbnNlcnRTY3JpcHRUYWcoZGF0YUxheWVyTmFtZSwgZHluYW1pY0NvbmZpZy5tZWFzdXJlbWVudElkKTtcclxuICAgIH1cclxuICAgIC8vIERldGVjdHMgaWYgdGhlcmUgYXJlIGNvbnNlbnQgc2V0dGluZ3MgdGhhdCBuZWVkIHRvIGJlIGNvbmZpZ3VyZWQuXHJcbiAgICBpZiAoZGVmYXVsdENvbnNlbnRTZXR0aW5nc0ZvckluaXQpIHtcclxuICAgICAgICBndGFnQ29yZShcImNvbnNlbnRcIiAvKiBDT05TRU5UICovLCAnZGVmYXVsdCcsIGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0KTtcclxuICAgICAgICBfc2V0Q29uc2VudERlZmF1bHRGb3JJbml0KHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcbiAgICAvLyBUaGlzIGNvbW1hbmQgaW5pdGlhbGl6ZXMgZ3RhZy5qcyBhbmQgb25seSBuZWVkcyB0byBiZSBjYWxsZWQgb25jZSBmb3IgdGhlIGVudGlyZSB3ZWIgYXBwLFxyXG4gICAgLy8gYnV0IHNpbmNlIGl0IGlzIGlkZW1wb3RlbnQsIHdlIGNhbiBjYWxsIGl0IG11bHRpcGxlIHRpbWVzLlxyXG4gICAgLy8gV2Uga2VlcCBpdCB0b2dldGhlciB3aXRoIG90aGVyIGluaXRpYWxpemF0aW9uIGxvZ2ljIGZvciBiZXR0ZXIgY29kZSBzdHJ1Y3R1cmUuXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgZ3RhZ0NvcmUoJ2pzJywgbmV3IERhdGUoKSk7XHJcbiAgICAvLyBVc2VyIGNvbmZpZyBhZGRlZCBmaXJzdC4gV2UgZG9uJ3Qgd2FudCB1c2VycyB0byBhY2NpZGVudGFsbHkgb3ZlcndyaXRlXHJcbiAgICAvLyBiYXNlIEZpcmViYXNlIGNvbmZpZyBwcm9wZXJ0aWVzLlxyXG4gICAgY29uc3QgY29uZmlnUHJvcGVydGllcyA9IChfYSA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jb25maWcpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHt9O1xyXG4gICAgLy8gZ3VhcmQgYWdhaW5zdCBkZXZlbG9wZXJzIGFjY2lkZW50YWxseSBzZXR0aW5nIHByb3BlcnRpZXMgd2l0aCBwcmVmaXggYGZpcmViYXNlX2BcclxuICAgIGNvbmZpZ1Byb3BlcnRpZXNbT1JJR0lOX0tFWV0gPSAnZmlyZWJhc2UnO1xyXG4gICAgY29uZmlnUHJvcGVydGllcy51cGRhdGUgPSB0cnVlO1xyXG4gICAgaWYgKGZpZCAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uZmlnUHJvcGVydGllc1tHQV9GSURfS0VZXSA9IGZpZDtcclxuICAgIH1cclxuICAgIC8vIEl0IHNob3VsZCBiZSB0aGUgZmlyc3QgY29uZmlnIGNvbW1hbmQgY2FsbGVkIG9uIHRoaXMgR0EtSURcclxuICAgIC8vIEluaXRpYWxpemUgdGhpcyBHQS1JRCBhbmQgc2V0IEZJRCBvbiBpdCB1c2luZyB0aGUgZ3RhZyBjb25maWcgQVBJLlxyXG4gICAgLy8gTm90ZTogVGhpcyB3aWxsIHRyaWdnZXIgYSBwYWdlX3ZpZXcgZXZlbnQgdW5sZXNzICdzZW5kX3BhZ2VfdmlldycgaXMgc2V0IHRvIGZhbHNlIGluXHJcbiAgICAvLyBgY29uZmlnUHJvcGVydGllc2AuXHJcbiAgICBndGFnQ29yZShcImNvbmZpZ1wiIC8qIENPTkZJRyAqLywgZHluYW1pY0NvbmZpZy5tZWFzdXJlbWVudElkLCBjb25maWdQcm9wZXJ0aWVzKTtcclxuICAgIC8vIERldGVjdHMgaWYgdGhlcmUgaXMgZGF0YSB0aGF0IHdpbGwgYmUgc2V0IG9uIGV2ZXJ5IGV2ZW50IGxvZ2dlZCBmcm9tIHRoZSBTREsuXHJcbiAgICBpZiAoZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQpIHtcclxuICAgICAgICBndGFnQ29yZShcInNldFwiIC8qIFNFVCAqLywgZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQpO1xyXG4gICAgICAgIF9zZXREZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdCh1bmRlZmluZWQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGR5bmFtaWNDb25maWcubWVhc3VyZW1lbnRJZDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQW5hbHl0aWNzIFNlcnZpY2UgY2xhc3MuXHJcbiAqL1xyXG5jbGFzcyBBbmFseXRpY3NTZXJ2aWNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGFwcCkge1xyXG4gICAgICAgIHRoaXMuYXBwID0gYXBwO1xyXG4gICAgfVxyXG4gICAgX2RlbGV0ZSgpIHtcclxuICAgICAgICBkZWxldGUgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFt0aGlzLmFwcC5vcHRpb25zLmFwcElkXTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIE1hcHMgYXBwSWQgdG8gZnVsbCBpbml0aWFsaXphdGlvbiBwcm9taXNlLiBXcmFwcGVkIGd0YWcgY2FsbHMgbXVzdCB3YWl0IG9uXHJcbiAqIGFsbCBvciBzb21lIG9mIHRoZXNlLCBkZXBlbmRpbmcgb24gdGhlIGNhbGwncyBgc2VuZF90b2AgcGFyYW0gYW5kIHRoZSBzdGF0dXNcclxuICogb2YgdGhlIGR5bmFtaWMgY29uZmlnIGZldGNoZXMgKHNlZSBiZWxvdykuXHJcbiAqL1xyXG5sZXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCA9IHt9O1xyXG4vKipcclxuICogTGlzdCBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy4gSW4gY2VydGFpbiBjYXNlcywgd3JhcHBlZCBndGFnIGNhbGxzXHJcbiAqIHdhaXQgb24gYWxsIHRoZXNlIHRvIGJlIGNvbXBsZXRlIGluIG9yZGVyIHRvIGRldGVybWluZSBpZiBpdCBjYW4gc2VsZWN0aXZlbHlcclxuICogd2FpdCBmb3Igb25seSBjZXJ0YWluIGluaXRpYWxpemF0aW9uIChGSUQpIHByb21pc2VzIG9yIGlmIGl0IG11c3Qgd2FpdCBmb3IgYWxsLlxyXG4gKi9cclxubGV0IGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgPSBbXTtcclxuLyoqXHJcbiAqIE1hcHMgZmV0Y2hlZCBtZWFzdXJlbWVudElkcyB0byBhcHBJZC4gUG9wdWxhdGVkIHdoZW4gdGhlIGFwcCdzIGR5bmFtaWMgY29uZmlnXHJcbiAqIGZldGNoIGNvbXBsZXRlcy4gSWYgYWxyZWFkeSBwb3B1bGF0ZWQsIGd0YWcgY29uZmlnIGNhbGxzIGNhbiB1c2UgdGhpcyB0b1xyXG4gKiBzZWxlY3RpdmVseSB3YWl0IGZvciBvbmx5IHRoaXMgYXBwJ3MgaW5pdGlhbGl6YXRpb24gcHJvbWlzZSAoRklEKSBpbnN0ZWFkIG9mIGFsbFxyXG4gKiBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICovXHJcbmNvbnN0IG1lYXN1cmVtZW50SWRUb0FwcElkID0ge307XHJcbi8qKlxyXG4gKiBOYW1lIGZvciB3aW5kb3cgZ2xvYmFsIGRhdGEgbGF5ZXIgYXJyYXkgdXNlZCBieSBHQTogZGVmYXVsdHMgdG8gJ2RhdGFMYXllcicuXHJcbiAqL1xyXG5sZXQgZGF0YUxheWVyTmFtZSA9ICdkYXRhTGF5ZXInO1xyXG4vKipcclxuICogTmFtZSBmb3Igd2luZG93IGdsb2JhbCBndGFnIGZ1bmN0aW9uIHVzZWQgYnkgR0E6IGRlZmF1bHRzIHRvICdndGFnJy5cclxuICovXHJcbmxldCBndGFnTmFtZSA9ICdndGFnJztcclxuLyoqXHJcbiAqIFJlcHJvZHVjdGlvbiBvZiBzdGFuZGFyZCBndGFnIGZ1bmN0aW9uIG9yIHJlZmVyZW5jZSB0byBleGlzdGluZ1xyXG4gKiBndGFnIGZ1bmN0aW9uIG9uIHdpbmRvdyBvYmplY3QuXHJcbiAqL1xyXG5sZXQgZ3RhZ0NvcmVGdW5jdGlvbjtcclxuLyoqXHJcbiAqIFdyYXBwZXIgYXJvdW5kIGd0YWcgZnVuY3Rpb24gdGhhdCBlbnN1cmVzIEZJRCBpcyBzZW50IHdpdGggYWxsXHJcbiAqIHJlbGV2YW50IGV2ZW50IGFuZCBjb25maWcgY2FsbHMuXHJcbiAqL1xyXG5sZXQgd3JhcHBlZEd0YWdGdW5jdGlvbjtcclxuLyoqXHJcbiAqIEZsYWcgdG8gZW5zdXJlIHBhZ2UgaW5pdGlhbGl6YXRpb24gc3RlcHMgKGNyZWF0aW9uIG9yIHdyYXBwaW5nIG9mXHJcbiAqIGRhdGFMYXllciBhbmQgZ3RhZyBzY3JpcHQpIGFyZSBvbmx5IHJ1biBvbmNlIHBlciBwYWdlIGxvYWQuXHJcbiAqL1xyXG5sZXQgZ2xvYmFsSW5pdERvbmUgPSBmYWxzZTtcclxuLyoqXHJcbiAqIENvbmZpZ3VyZXMgRmlyZWJhc2UgQW5hbHl0aWNzIHRvIHVzZSBjdXN0b20gYGd0YWdgIG9yIGBkYXRhTGF5ZXJgIG5hbWVzLlxyXG4gKiBJbnRlbmRlZCB0byBiZSB1c2VkIGlmIGBndGFnLmpzYCBzY3JpcHQgaGFzIGJlZW4gaW5zdGFsbGVkIG9uXHJcbiAqIHRoaXMgcGFnZSBpbmRlcGVuZGVudGx5IG9mIEZpcmViYXNlIEFuYWx5dGljcywgYW5kIGlzIHVzaW5nIG5vbi1kZWZhdWx0XHJcbiAqIG5hbWVzIGZvciBlaXRoZXIgdGhlIGBndGFnYCBmdW5jdGlvbiBvciBmb3IgYGRhdGFMYXllcmAuXHJcbiAqIE11c3QgYmUgY2FsbGVkIGJlZm9yZSBjYWxsaW5nIGBnZXRBbmFseXRpY3MoKWAgb3IgaXQgd29uJ3RcclxuICogaGF2ZSBhbnkgZWZmZWN0LlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBwYXJhbSBvcHRpb25zIC0gQ3VzdG9tIGd0YWcgYW5kIGRhdGFMYXllciBuYW1lcy5cclxuICovXHJcbmZ1bmN0aW9uIHNldHRpbmdzKG9wdGlvbnMpIHtcclxuICAgIGlmIChnbG9iYWxJbml0RG9uZSkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYWxyZWFkeS1pbml0aWFsaXplZFwiIC8qIEFMUkVBRFlfSU5JVElBTElaRUQgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuZGF0YUxheWVyTmFtZSkge1xyXG4gICAgICAgIGRhdGFMYXllck5hbWUgPSBvcHRpb25zLmRhdGFMYXllck5hbWU7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5ndGFnTmFtZSkge1xyXG4gICAgICAgIGd0YWdOYW1lID0gb3B0aW9ucy5ndGFnTmFtZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmV0dXJucyB0cnVlIGlmIG5vIGVudmlyb25tZW50IG1pc21hdGNoIGlzIGZvdW5kLlxyXG4gKiBJZiBlbnZpcm9ubWVudCBtaXNtYXRjaGVzIGFyZSBmb3VuZCwgdGhyb3dzIGFuIElOVkFMSURfQU5BTFlUSUNTX0NPTlRFWFRcclxuICogZXJyb3IgdGhhdCBhbHNvIGxpc3RzIGRldGFpbHMgZm9yIGVhY2ggbWlzbWF0Y2ggZm91bmQuXHJcbiAqL1xyXG5mdW5jdGlvbiB3YXJuT25Ccm93c2VyQ29udGV4dE1pc21hdGNoKCkge1xyXG4gICAgY29uc3QgbWlzbWF0Y2hlZEVudk1lc3NhZ2VzID0gW107XHJcbiAgICBpZiAoaXNCcm93c2VyRXh0ZW5zaW9uKCkpIHtcclxuICAgICAgICBtaXNtYXRjaGVkRW52TWVzc2FnZXMucHVzaCgnVGhpcyBpcyBhIGJyb3dzZXIgZXh0ZW5zaW9uIGVudmlyb25tZW50LicpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcmVDb29raWVzRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgbWlzbWF0Y2hlZEVudk1lc3NhZ2VzLnB1c2goJ0Nvb2tpZXMgYXJlIG5vdCBhdmFpbGFibGUuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAobWlzbWF0Y2hlZEVudk1lc3NhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBkZXRhaWxzID0gbWlzbWF0Y2hlZEVudk1lc3NhZ2VzXHJcbiAgICAgICAgICAgIC5tYXAoKG1lc3NhZ2UsIGluZGV4KSA9PiBgKCR7aW5kZXggKyAxfSkgJHttZXNzYWdlfWApXHJcbiAgICAgICAgICAgIC5qb2luKCcgJyk7XHJcbiAgICAgICAgY29uc3QgZXJyID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLWFuYWx5dGljcy1jb250ZXh0XCIgLyogSU5WQUxJRF9BTkFMWVRJQ1NfQ09OVEVYVCAqLywge1xyXG4gICAgICAgICAgICBlcnJvckluZm86IGRldGFpbHNcclxuICAgICAgICB9KTtcclxuICAgICAgICBsb2dnZXIud2FybihlcnIubWVzc2FnZSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIEFuYWx5dGljcyBpbnN0YW5jZSBmYWN0b3J5LlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmZ1bmN0aW9uIGZhY3RvcnkoYXBwLCBpbnN0YWxsYXRpb25zLCBvcHRpb25zKSB7XHJcbiAgICB3YXJuT25Ccm93c2VyQ29udGV4dE1pc21hdGNoKCk7XHJcbiAgICBjb25zdCBhcHBJZCA9IGFwcC5vcHRpb25zLmFwcElkO1xyXG4gICAgaWYgKCFhcHBJZCkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBwLWlkXCIgLyogTk9fQVBQX0lEICovKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwLm9wdGlvbnMuYXBpS2V5KSB7XHJcbiAgICAgICAgaWYgKGFwcC5vcHRpb25zLm1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oYFRoZSBcImFwaUtleVwiIGZpZWxkIGlzIGVtcHR5IGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIFRoaXMgaXMgbmVlZGVkIHRvIGZldGNoIHRoZSBsYXRlc3RgICtcclxuICAgICAgICAgICAgICAgIGAgbWVhc3VyZW1lbnQgSUQgZm9yIHRoaXMgRmlyZWJhc2UgYXBwLiBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7YXBwLm9wdGlvbnMubWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgIGAgcHJvdmlkZWQgaW4gdGhlIFwibWVhc3VyZW1lbnRJZFwiIGZpZWxkIGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwaS1rZXlcIiAvKiBOT19BUElfS0VZICovKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthcHBJZF0gIT0gbnVsbCkge1xyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiYWxyZWFkeS1leGlzdHNcIiAvKiBBTFJFQURZX0VYSVNUUyAqLywge1xyXG4gICAgICAgICAgICBpZDogYXBwSWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghZ2xvYmFsSW5pdERvbmUpIHtcclxuICAgICAgICAvLyBTdGVwcyBoZXJlIHNob3VsZCBvbmx5IGJlIGRvbmUgb25jZSBwZXIgcGFnZTogY3JlYXRpb24gb3Igd3JhcHBpbmdcclxuICAgICAgICAvLyBvZiBkYXRhTGF5ZXIgYW5kIGdsb2JhbCBndGFnIGZ1bmN0aW9uLlxyXG4gICAgICAgIGdldE9yQ3JlYXRlRGF0YUxheWVyKGRhdGFMYXllck5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHsgd3JhcHBlZEd0YWcsIGd0YWdDb3JlIH0gPSB3cmFwT3JDcmVhdGVHdGFnKGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIG1lYXN1cmVtZW50SWRUb0FwcElkLCBkYXRhTGF5ZXJOYW1lLCBndGFnTmFtZSk7XHJcbiAgICAgICAgd3JhcHBlZEd0YWdGdW5jdGlvbiA9IHdyYXBwZWRHdGFnO1xyXG4gICAgICAgIGd0YWdDb3JlRnVuY3Rpb24gPSBndGFnQ29yZTtcclxuICAgICAgICBnbG9iYWxJbml0RG9uZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyBBc3luYyBidXQgbm9uLWJsb2NraW5nLlxyXG4gICAgLy8gVGhpcyBtYXAgcmVmbGVjdHMgdGhlIGNvbXBsZXRpb24gc3RhdGUgb2YgYWxsIHByb21pc2VzIGZvciBlYWNoIGFwcElkLlxyXG4gICAgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthcHBJZF0gPSBfaW5pdGlhbGl6ZUFuYWx5dGljcyhhcHAsIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QsIG1lYXN1cmVtZW50SWRUb0FwcElkLCBpbnN0YWxsYXRpb25zLCBndGFnQ29yZUZ1bmN0aW9uLCBkYXRhTGF5ZXJOYW1lLCBvcHRpb25zKTtcclxuICAgIGNvbnN0IGFuYWx5dGljc0luc3RhbmNlID0gbmV3IEFuYWx5dGljc1NlcnZpY2UoYXBwKTtcclxuICAgIHJldHVybiBhbmFseXRpY3NJbnN0YW5jZTtcclxufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gYXBwLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBUaGUge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IHRvIHVzZS5cclxuICovXHJcbmZ1bmN0aW9uIGdldEFuYWx5dGljcyhhcHAgPSBnZXRBcHAoKSkge1xyXG4gICAgYXBwID0gZ2V0TW9kdWxhckluc3RhbmNlKGFwcCk7XHJcbiAgICAvLyBEZXBlbmRlbmNpZXNcclxuICAgIGNvbnN0IGFuYWx5dGljc1Byb3ZpZGVyID0gX2dldFByb3ZpZGVyKGFwcCwgQU5BTFlUSUNTX1RZUEUpO1xyXG4gICAgaWYgKGFuYWx5dGljc1Byb3ZpZGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgIHJldHVybiBhbmFseXRpY3NQcm92aWRlci5nZXRJbW1lZGlhdGUoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpbml0aWFsaXplQW5hbHl0aWNzKGFwcCk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgYW4ge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBhcHAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFwcCAtIFRoZSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gdG8gdXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gaW5pdGlhbGl6ZUFuYWx5dGljcyhhcHAsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8gRGVwZW5kZW5jaWVzXHJcbiAgICBjb25zdCBhbmFseXRpY3NQcm92aWRlciA9IF9nZXRQcm92aWRlcihhcHAsIEFOQUxZVElDU19UWVBFKTtcclxuICAgIGlmIChhbmFseXRpY3NQcm92aWRlci5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICBjb25zdCBleGlzdGluZ0luc3RhbmNlID0gYW5hbHl0aWNzUHJvdmlkZXIuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgaWYgKGRlZXBFcXVhbChvcHRpb25zLCBhbmFseXRpY3NQcm92aWRlci5nZXRPcHRpb25zKCkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0luc3RhbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhbHJlYWR5LWluaXRpYWxpemVkXCIgLyogQUxSRUFEWV9JTklUSUFMSVpFRCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgYW5hbHl0aWNzSW5zdGFuY2UgPSBhbmFseXRpY3NQcm92aWRlci5pbml0aWFsaXplKHsgb3B0aW9ucyB9KTtcclxuICAgIHJldHVybiBhbmFseXRpY3NJbnN0YW5jZTtcclxufVxyXG4vKipcclxuICogVGhpcyBpcyBhIHB1YmxpYyBzdGF0aWMgbWV0aG9kIHByb3ZpZGVkIHRvIHVzZXJzIHRoYXQgd3JhcHMgZm91ciBkaWZmZXJlbnQgY2hlY2tzOlxyXG4gKlxyXG4gKiAxLiBDaGVjayBpZiBpdCdzIG5vdCBhIGJyb3dzZXIgZXh0ZW5zaW9uIGVudmlyb25tZW50LlxyXG4gKiAyLiBDaGVjayBpZiBjb29raWVzIGFyZSBlbmFibGVkIGluIGN1cnJlbnQgYnJvd3Nlci5cclxuICogMy4gQ2hlY2sgaWYgSW5kZXhlZERCIGlzIHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBlbnZpcm9ubWVudC5cclxuICogNC4gQ2hlY2sgaWYgdGhlIGN1cnJlbnQgYnJvd3NlciBjb250ZXh0IGlzIHZhbGlkIGZvciB1c2luZyBgSW5kZXhlZERCLm9wZW4oKWAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGlzU3VwcG9ydGVkKCkge1xyXG4gICAgaWYgKGlzQnJvd3NlckV4dGVuc2lvbigpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcmVDb29raWVzRW5hYmxlZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKCFpc0luZGV4ZWREQkF2YWlsYWJsZSgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpc0RCT3BlbmFibGUgPSBhd2FpdCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCk7XHJcbiAgICAgICAgcmV0dXJuIGlzREJPcGVuYWJsZTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogVXNlIGd0YWcgYGNvbmZpZ2AgY29tbWFuZCB0byBzZXQgYHNjcmVlbl9uYW1lYC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIGxvZ0V2ZW50fSB3aXRoIGBldmVudE5hbWVgIGFzICdzY3JlZW5fdmlldycgYW5kIGFkZCByZWxldmFudCBgZXZlbnRQYXJhbXNgLlxyXG4gKiBTZWUge0BsaW5rIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL2FuYWx5dGljcy9zY3JlZW52aWV3cyB8IFRyYWNrIFNjcmVlbnZpZXdzfS5cclxuICpcclxuICogQHBhcmFtIGFuYWx5dGljc0luc3RhbmNlIC0gVGhlIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gc2NyZWVuTmFtZSAtIFNjcmVlbiBuYW1lIHRvIHNldC5cclxuICovXHJcbmZ1bmN0aW9uIHNldEN1cnJlbnRTY3JlZW4oYW5hbHl0aWNzSW5zdGFuY2UsIHNjcmVlbk5hbWUsIG9wdGlvbnMpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldEN1cnJlbnRTY3JlZW4kMSh3cmFwcGVkR3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgc2NyZWVuTmFtZSwgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBVc2UgZ3RhZyBgY29uZmlnYCBjb21tYW5kIHRvIHNldCBgdXNlcl9pZGAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFuYWx5dGljc0luc3RhbmNlIC0gVGhlIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gaWQgLSBVc2VyIElEIHRvIHNldC5cclxuICovXHJcbmZ1bmN0aW9uIHNldFVzZXJJZChhbmFseXRpY3NJbnN0YW5jZSwgaWQsIG9wdGlvbnMpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldFVzZXJJZCQxKHdyYXBwZWRHdGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbYW5hbHl0aWNzSW5zdGFuY2UuYXBwLm9wdGlvbnMuYXBwSWRdLCBpZCwgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBVc2UgZ3RhZyBgY29uZmlnYCBjb21tYW5kIHRvIHNldCBhbGwgcGFyYW1zIHNwZWNpZmllZC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gc2V0VXNlclByb3BlcnRpZXMoYW5hbHl0aWNzSW5zdGFuY2UsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldFVzZXJQcm9wZXJ0aWVzJDEod3JhcHBlZEd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthbmFseXRpY3NJbnN0YW5jZS5hcHAub3B0aW9ucy5hcHBJZF0sIHByb3BlcnRpZXMsIG9wdGlvbnMpLmNhdGNoKGUgPT4gbG9nZ2VyLmVycm9yKGUpKTtcclxufVxyXG4vKipcclxuICogU2V0cyB3aGV0aGVyIEdvb2dsZSBBbmFseXRpY3MgY29sbGVjdGlvbiBpcyBlbmFibGVkIGZvciB0aGlzIGFwcCBvbiB0aGlzIGRldmljZS5cclxuICogU2V0cyBnbG9iYWwgYHdpbmRvd1snZ2EtZGlzYWJsZS1hbmFseXRpY3NJZCddID0gdHJ1ZTtgXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFuYWx5dGljc0luc3RhbmNlIC0gVGhlIHtAbGluayBBbmFseXRpY3N9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gZW5hYmxlZCAtIElmIHRydWUsIGVuYWJsZXMgY29sbGVjdGlvbiwgaWYgZmFsc2UsIGRpc2FibGVzIGl0LlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQoYW5hbHl0aWNzSW5zdGFuY2UsIGVuYWJsZWQpIHtcclxuICAgIGFuYWx5dGljc0luc3RhbmNlID0gZ2V0TW9kdWxhckluc3RhbmNlKGFuYWx5dGljc0luc3RhbmNlKTtcclxuICAgIHNldEFuYWx5dGljc0NvbGxlY3Rpb25FbmFibGVkJDEoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthbmFseXRpY3NJbnN0YW5jZS5hcHAub3B0aW9ucy5hcHBJZF0sIGVuYWJsZWQpLmNhdGNoKGUgPT4gbG9nZ2VyLmVycm9yKGUpKTtcclxufVxyXG4vKipcclxuICogQWRkcyBkYXRhIHRoYXQgd2lsbCBiZSBzZXQgb24gZXZlcnkgZXZlbnQgbG9nZ2VkIGZyb20gdGhlIFNESywgaW5jbHVkaW5nIGF1dG9tYXRpYyBvbmVzLlxyXG4gKiBXaXRoIGd0YWcncyBcInNldFwiIGNvbW1hbmQsIHRoZSB2YWx1ZXMgcGFzc2VkIHBlcnNpc3Qgb24gdGhlIGN1cnJlbnQgcGFnZSBhbmQgYXJlIHBhc3NlZCB3aXRoXHJcbiAqIGFsbCBzdWJzZXF1ZW50IGV2ZW50cy5cclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0gY3VzdG9tUGFyYW1zIC0gQW55IGN1c3RvbSBwYXJhbXMgdGhlIHVzZXIgbWF5IHBhc3MgdG8gZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIHNldERlZmF1bHRFdmVudFBhcmFtZXRlcnMoY3VzdG9tUGFyYW1zKSB7XHJcbiAgICAvLyBDaGVjayBpZiByZWZlcmVuY2UgdG8gZXhpc3RpbmcgZ3RhZyBmdW5jdGlvbiBvbiB3aW5kb3cgb2JqZWN0IGV4aXN0c1xyXG4gICAgaWYgKHdyYXBwZWRHdGFnRnVuY3Rpb24pIHtcclxuICAgICAgICB3cmFwcGVkR3RhZ0Z1bmN0aW9uKFwic2V0XCIgLyogU0VUICovLCBjdXN0b21QYXJhbXMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgX3NldERlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0KGN1c3RvbVBhcmFtcyk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFNlbmRzIGEgR29vZ2xlIEFuYWx5dGljcyBldmVudCB3aXRoIGdpdmVuIGBldmVudFBhcmFtc2AuIFRoaXMgbWV0aG9kXHJcbiAqIGF1dG9tYXRpY2FsbHkgYXNzb2NpYXRlcyB0aGlzIGxvZ2dlZCBldmVudCB3aXRoIHRoaXMgRmlyZWJhc2Ugd2ViXHJcbiAqIGFwcCBpbnN0YW5jZSBvbiB0aGlzIGRldmljZS5cclxuICogTGlzdCBvZiBvZmZpY2lhbCBldmVudCBwYXJhbWV0ZXJzIGNhbiBiZSBmb3VuZCBpbiB0aGUgZ3RhZy5qc1xyXG4gKiByZWZlcmVuY2UgZG9jdW1lbnRhdGlvbjpcclxuICoge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2d0YWdqcy9yZWZlcmVuY2UvZ2E0LWV2ZW50c1xyXG4gKiB8IHRoZSBHQTQgcmVmZXJlbmNlIGRvY3VtZW50YXRpb259LlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBsb2dFdmVudChhbmFseXRpY3NJbnN0YW5jZSwgZXZlbnROYW1lLCBldmVudFBhcmFtcywgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgbG9nRXZlbnQkMSh3cmFwcGVkR3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgZXZlbnROYW1lLCBldmVudFBhcmFtcywgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIHRoZSBhcHBsaWNhYmxlIGVuZCB1c2VyIGNvbnNlbnQgc3RhdGUgZm9yIHRoaXMgd2ViIGFwcCBhY3Jvc3MgYWxsIGd0YWcgcmVmZXJlbmNlcyBvbmNlXHJcbiAqIEZpcmViYXNlIEFuYWx5dGljcyBpcyBpbml0aWFsaXplZC5cclxuICpcclxuICogVXNlIHRoZSB7QGxpbmsgQ29uc2VudFNldHRpbmdzfSB0byBzcGVjaWZ5IGluZGl2aWR1YWwgY29uc2VudCB0eXBlIHZhbHVlcy4gQnkgZGVmYXVsdCBjb25zZW50XHJcbiAqIHR5cGVzIGFyZSBzZXQgdG8gXCJncmFudGVkXCIuXHJcbiAqIEBwdWJsaWNcclxuICogQHBhcmFtIGNvbnNlbnRTZXR0aW5ncyAtIE1hcHMgdGhlIGFwcGxpY2FibGUgZW5kIHVzZXIgY29uc2VudCBzdGF0ZSBmb3IgZ3RhZy5qcy5cclxuICovXHJcbmZ1bmN0aW9uIHNldENvbnNlbnQoY29uc2VudFNldHRpbmdzKSB7XHJcbiAgICAvLyBDaGVjayBpZiByZWZlcmVuY2UgdG8gZXhpc3RpbmcgZ3RhZyBmdW5jdGlvbiBvbiB3aW5kb3cgb2JqZWN0IGV4aXN0c1xyXG4gICAgaWYgKHdyYXBwZWRHdGFnRnVuY3Rpb24pIHtcclxuICAgICAgICB3cmFwcGVkR3RhZ0Z1bmN0aW9uKFwiY29uc2VudFwiIC8qIENPTlNFTlQgKi8sICd1cGRhdGUnLCBjb25zZW50U2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgX3NldENvbnNlbnREZWZhdWx0Rm9ySW5pdChjb25zZW50U2V0dGluZ3MpO1xyXG4gICAgfVxyXG59XG5cbmNvbnN0IG5hbWUgPSBcIkBmaXJlYmFzZS9hbmFseXRpY3NcIjtcbmNvbnN0IHZlcnNpb24gPSBcIjAuOC4zXCI7XG5cbi8qKlxyXG4gKiBGaXJlYmFzZSBBbmFseXRpY3NcclxuICpcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiByZWdpc3RlckFuYWx5dGljcygpIHtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KEFOQUxZVElDU19UWVBFLCAoY29udGFpbmVyLCB7IG9wdGlvbnM6IGFuYWx5dGljc09wdGlvbnMgfSkgPT4ge1xyXG4gICAgICAgIC8vIGdldEltbWVkaWF0ZSBmb3IgRmlyZWJhc2VBcHAgd2lsbCBhbHdheXMgc3VjY2VlZFxyXG4gICAgICAgIGNvbnN0IGFwcCA9IGNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgY29uc3QgaW5zdGFsbGF0aW9ucyA9IGNvbnRhaW5lclxyXG4gICAgICAgICAgICAuZ2V0UHJvdmlkZXIoJ2luc3RhbGxhdGlvbnMtaW50ZXJuYWwnKVxyXG4gICAgICAgICAgICAuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIGZhY3RvcnkoYXBwLCBpbnN0YWxsYXRpb25zLCBhbmFseXRpY3NPcHRpb25zKTtcclxuICAgIH0sIFwiUFVCTElDXCIgLyogUFVCTElDICovKSk7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgnYW5hbHl0aWNzLWludGVybmFsJywgaW50ZXJuYWxGYWN0b3J5LCBcIlBSSVZBVEVcIiAvKiBQUklWQVRFICovKSk7XHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbiAgICAvLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24sICdlc20yMDE3Jyk7XHJcbiAgICBmdW5jdGlvbiBpbnRlcm5hbEZhY3RvcnkoY29udGFpbmVyKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl0aWNzID0gY29udGFpbmVyLmdldFByb3ZpZGVyKEFOQUxZVElDU19UWVBFKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGxvZ0V2ZW50OiAoZXZlbnROYW1lLCBldmVudFBhcmFtcywgb3B0aW9ucykgPT4gbG9nRXZlbnQoYW5hbHl0aWNzLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImludGVyb3AtY29tcG9uZW50LXJlZy1mYWlsZWRcIiAvKiBJTlRFUk9QX0NPTVBPTkVOVF9SRUdfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbnJlZ2lzdGVyQW5hbHl0aWNzKCk7XG5cbmV4cG9ydCB7IGdldEFuYWx5dGljcywgaW5pdGlhbGl6ZUFuYWx5dGljcywgaXNTdXBwb3J0ZWQsIGxvZ0V2ZW50LCBzZXRBbmFseXRpY3NDb2xsZWN0aW9uRW5hYmxlZCwgc2V0Q29uc2VudCwgc2V0Q3VycmVudFNjcmVlbiwgc2V0RGVmYXVsdEV2ZW50UGFyYW1ldGVycywgc2V0VXNlcklkLCBzZXRVc2VyUHJvcGVydGllcywgc2V0dGluZ3MgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCIvLyB0aGlzIGlzIHdoZXJlIHdlIGNhbiBoYXZlIHRoZSBjbGFzc2VzIGFuZCBmdW5jdGlvbnMgZm9yIGJ1aWxkaW5nIHRoZSBldmVudHNcclxuLy8gdG8gc2VuZCB0byBhbiBhbmFseXRpY3MgcmVjb3JkZXIgKGZpcmViYXNlPyBscnM/KVxyXG5cclxuaW1wb3J0IHsgcURhdGEsIGFuc3dlckRhdGEgfSBmcm9tICcuL3F1ZXN0aW9uRGF0YSc7XHJcbmltcG9ydCB7IGxvZ0V2ZW50IH0gZnJvbSAnZmlyZWJhc2UvYW5hbHl0aWNzJztcclxuaW1wb3J0IHsgYnVja2V0IH0gZnJvbSAnLi4vYXNzZXNzbWVudC9idWNrZXREYXRhJ1xyXG5cclxuXHJcbi8vIENyZWF0ZSBhIHNpbmdsZXRvbiBjbGFzcyBmb3IgdGhlIGFuYWx5dGljcyBldmVudHNcclxuZXhwb3J0IGNsYXNzIEFuYWx5dGljc0V2ZW50cyB7XHJcblxyXG5cdHByb3RlY3RlZCBzdGF0aWMgdXVpZDogc3RyaW5nO1xyXG5cdHByb3RlY3RlZCBzdGF0aWMgdXNlclNvdXJjZTogc3RyaW5nO1xyXG5cdHByb3RlY3RlZCBzdGF0aWMgY2xhdDtcclxuXHRwcm90ZWN0ZWQgc3RhdGljIGNsb247XHJcblx0cHJvdGVjdGVkIHN0YXRpYyBnYW5hO1xyXG5cdHByb3RlY3RlZCBzdGF0aWMgbGF0bG9uZztcclxuXHQvLyB2YXIgY2l0eSwgcmVnaW9uLCBjb3VudHJ5O1xyXG5cdHByb3RlY3RlZCBzdGF0aWMgZGF0YVVSTDtcclxuXHJcblx0cHJvdGVjdGVkIHN0YXRpYyBhcHBWZXJzaW9uO1xyXG5cdHByb3RlY3RlZCBzdGF0aWMgY29udGVudFZlcnNpb247XHJcblxyXG5cdHByb3RlY3RlZCBzdGF0aWMgYXNzZXNzbWVudFR5cGU6IHN0cmluZztcclxuXHJcblx0c3RhdGljIGluc3RhbmNlOiBBbmFseXRpY3NFdmVudHM7XHJcblxyXG5cdHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcblx0XHQvLyBJbml0aWFsaXplIHRoZSBjbGFzc1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGdldEluc3RhbmNlKCk6IEFuYWx5dGljc0V2ZW50cyB7XHJcblx0XHRpZiAoIUFuYWx5dGljc0V2ZW50cy5pbnN0YW5jZSkge1xyXG5cdFx0XHRBbmFseXRpY3NFdmVudHMuaW5zdGFuY2UgPSBuZXcgQW5hbHl0aWNzRXZlbnRzKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIEFuYWx5dGljc0V2ZW50cy5pbnN0YW5jZTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBzZXRBc3Nlc3NtZW50VHlwZShhc3Nlc3NtZW50VHlwZTogc3RyaW5nKTogdm9pZCB7XHJcblx0XHRBbmFseXRpY3NFdmVudHMuYXNzZXNzbWVudFR5cGUgPSBhc3Nlc3NtZW50VHlwZTtcclxuXHR9XHJcblxyXG5cdC8vIEdldCBMb2NhdGlvblxyXG5cdHN0YXRpYyBnZXRMb2NhdGlvbigpOiB2b2lkIHtcclxuXHRcdGNvbnNvbGUubG9nKFwic3RhcnRpbmcgdG8gZ2V0IGxvY2F0aW9uXCIpO1xyXG5cdFx0ZmV0Y2goYGh0dHBzOi8vaXBpbmZvLmlvL2pzb24/dG9rZW49YjYyNjg3MjcxNzg2MTBgKS50aGVuKChyZXNwb25zZSkgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcImdvdCBsb2NhdGlvbiByZXNwb25zZVwiKTtcclxuXHRcdFx0aWYoIXJlc3BvbnNlLm9rKSB7XHJcblx0XHRcdFx0dGhyb3cgRXJyb3IocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmpzb24oKVxyXG5cdFx0fSkudGhlbigoanNvblJlc3BvbnNlKSAgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhqc29uUmVzcG9uc2UpO1xyXG5cdFx0XHRBbmFseXRpY3NFdmVudHMubGF0bG9uZyA9IGpzb25SZXNwb25zZS5sb2M7XHJcblx0XHRcdHZhciBscGllY2VzID0gQW5hbHl0aWNzRXZlbnRzLmxhdGxvbmcuc3BsaXQoXCIsXCIpO1xyXG5cdFx0XHR2YXIgbGF0ID0gcGFyc2VGbG9hdChscGllY2VzWzBdKS50b0ZpeGVkKDIpO1xyXG5cdFx0XHR2YXIgbG9uID0gcGFyc2VGbG9hdChscGllY2VzWzFdKS50b0ZpeGVkKDEpO1xyXG5cdFx0XHRBbmFseXRpY3NFdmVudHMuY2xhdCA9IGxhdDtcclxuXHRcdFx0QW5hbHl0aWNzRXZlbnRzLmNsb24gPSBsb247XHJcblx0XHRcdEFuYWx5dGljc0V2ZW50cy5sYXRsb25nID0gXCJcIjtcclxuXHRcdFx0bHBpZWNlcyA9IFtdO1xyXG5cdFx0XHQvLyBjaXR5ID0ganNvblJlc3BvbnNlLmNpdHk7XHJcblx0XHRcdC8vIHJlZ2lvbiA9IGpzb25SZXNwb25zZS5yZWdpb247XHJcblx0XHRcdC8vIGNvdW50cnkgPSBqc29uUmVzcG9uc2UuY291bnRyeTtcclxuXHRcdFx0QW5hbHl0aWNzRXZlbnRzLnNlbmRMb2NhdGlvbigpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cdFx0fSkuY2F0Y2goKGVycikgPT4ge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oYGxvY2F0aW9uIGZhaWxlZCB0byB1cGRhdGUhIGVuY291bnRlcmVkIGVycm9yICR7ZXJyLm1zZ31gKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHQvLyBMaW5rIEFuYWx5dGljc1xyXG5cdHN0YXRpYyBsaW5rQW5hbHl0aWNzKG5ld2dhbmEsIGRhdGF1cmwpOiB2b2lkIHtcclxuXHRcdEFuYWx5dGljc0V2ZW50cy5nYW5hID0gbmV3Z2FuYTtcclxuXHRcdEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMID0gZGF0YXVybDtcclxuXHR9XHJcblxyXG5cdC8vIFNldCBVVUlEXHJcblx0c3RhdGljIHNldFV1aWQobmV3VXVpZDogc3RyaW5nLCBuZXdVc2VyU291cmNlOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdEFuYWx5dGljc0V2ZW50cy51dWlkID0gbmV3VXVpZDtcclxuXHRcdEFuYWx5dGljc0V2ZW50cy51c2VyU291cmNlID0gbmV3VXNlclNvdXJjZTtcclxuXHR9XHJcblxyXG5cdC8vIFNlbmQgSW5pdFxyXG5cdHN0YXRpYyBzZW5kSW5pdChhcHBWZXJzaW9uOiBzdHJpbmcsIGNvbnRlbnRWZXJzaW9uOiBzdHJpbmcpOiB2b2lkIHtcclxuXHRcdEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uID0gYXBwVmVyc2lvbjtcclxuXHRcdEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbiA9IGNvbnRlbnRWZXJzaW9uO1xyXG5cclxuXHRcdEFuYWx5dGljc0V2ZW50cy5nZXRMb2NhdGlvbigpO1xyXG5cclxuXHRcdHZhciBldmVudFN0cmluZyA9IFwidXNlciBcIiArIEFuYWx5dGljc0V2ZW50cy51dWlkICsgXCIgb3BlbmVkIHRoZSBhc3Nlc3NtZW50XCI7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xyXG5cclxuXHRcdGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLFwib3BlbmVkXCIsIHtcclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIEdldCBBcHAgTGFuZ3VhZ2UgRnJvbSBEYXRhIFVSTFxyXG5cdHN0YXRpYyBnZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKGFwcFR5cGU6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0XHQvLyBDaGVjayBpZiBhcHAgdHlwZSBpcyBub3QgZW1wdHkgYW5kIHNwbGl0IHRoZSBzdHJpbmcgYnkgdGhlIGh5cGhlbiB0aGVuIHJldHVybiB0aGUgZmlyc3QgZWxlbWVudFxyXG5cdFx0aWYgKGFwcFR5cGUgJiYgYXBwVHlwZSAhPT0gXCJcIiAmJiBhcHBUeXBlLmluY2x1ZGVzKFwiLVwiKSkge1xyXG5cdFx0XHRyZXR1cm4gYXBwVHlwZS5zcGxpdChcIi1cIilbMF07XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIFwiTm90QXZhaWxhYmxlXCI7XHJcblx0fVxyXG5cclxuXHQvLyBHZXQgQXBwIFR5cGUgRnJvbSBEYXRhIFVSTFxyXG5cdHN0YXRpYyBnZXRBcHBUeXBlRnJvbURhdGFVUkwoYXBwVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRcdC8vIENoZWNrIGlmIGFwcCB0eXBlIGlzIG5vdCBlbXB0eSBhbmQgc3BsaXQgdGhlIHN0cmluZyBieSB0aGUgaHlwaGVuIHRoZW4gcmV0dXJuIHRoZSBsYXN0IGVsZW1lbnRcclxuXHRcdGlmIChhcHBUeXBlICYmIGFwcFR5cGUgIT09IFwiXCIgJiYgYXBwVHlwZS5pbmNsdWRlcyhcIi1cIikpIHtcclxuXHRcdFx0cmV0dXJuIGFwcFR5cGUuc3BsaXQoXCItXCIpWzFdO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBcIk5vdEF2YWlsYWJsZVwiO1xyXG5cdH1cclxuXHJcblx0Ly8gU2VuZCBMb2NhdGlvblxyXG5cdHN0YXRpYyBzZW5kTG9jYXRpb24oKTogdm9pZCB7XHJcblx0XHR2YXIgZXZlbnRTdHJpbmcgPSBcIlNlbmRpbmcgVXNlciBjb29yZGluYXRlczogXCIgKyBBbmFseXRpY3NFdmVudHMudXVpZCArIFwiIDogXCIgKyBBbmFseXRpY3NFdmVudHMuY2xhdCArIFwiLCBcIiArIEFuYWx5dGljc0V2ZW50cy5jbG9uO1xyXG5cdFx0Y29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xyXG5cclxuXHRcdGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLFwidXNlcl9sb2NhdGlvblwiLCB7XHJcblx0XHRcdHVzZXI6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxyXG5cdFx0XHRsYW5nOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXHJcblx0XHRcdGFwcDogQW5hbHl0aWNzRXZlbnRzLmdldEFwcFR5cGVGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXHJcblx0XHRcdGxhdGxvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJJTklUSUFMSVpFRCBFVkVOVCBTRU5UXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJBcHAgTGFuZ3VhZ2U6IFwiICsgQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiQXBwIFR5cGU6IFwiICsgQW5hbHl0aWNzRXZlbnRzLmdldEFwcFR5cGVGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCkpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJBcHAgVmVyc2lvbjogXCIgKyBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkNvbnRlbnQgVmVyc2lvbjogXCIgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xyXG5cclxuXHRcdGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLFwiaW5pdGlhbGl6ZWRcIiwge1xyXG5cdFx0XHR0eXBlOiBcImluaXRpYWxpemVkXCIsXHJcblx0XHRcdGNsVXNlcklkOiBBbmFseXRpY3NFdmVudHMudXVpZCxcclxuXHRcdFx0dXNlclNvdXJjZTogQW5hbHl0aWNzRXZlbnRzLnVzZXJTb3VyY2UsXHJcblx0XHRcdGxhdExvbmc6IEFuYWx5dGljc0V2ZW50cy5qb2luTGF0TG9uZyhBbmFseXRpY3NFdmVudHMuY2xhdCwgQW5hbHl0aWNzRXZlbnRzLmNsb24pLFxyXG5cdFx0XHRhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcclxuXHRcdFx0Y29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbixcclxuXHRcdFx0Ly8gY2l0eTogY2l0eSxcclxuXHRcdFx0Ly8gcmVnaW9uOiByZWdpb24sXHJcblx0XHRcdC8vIGNvdW50cnk6IGNvdW50cnksXHJcblx0XHRcdGFwcDogQW5hbHl0aWNzRXZlbnRzLmdldEFwcFR5cGVGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXHJcblx0XHRcdGxhbmc6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBMYW5ndWFnZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBTZW5kIEFuc3dlcmVkXHJcblx0c3RhdGljIHNlbmRBbnN3ZXJlZCh0aGVROiBxRGF0YSwgdGhlQTogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIpOiB2b2lkIHtcclxuXHRcdHZhciBhbnMgPSB0aGVRLmFuc3dlcnNbdGhlQSAtIDFdO1xyXG5cclxuXHRcdHZhciBpc2NvcnJlY3QgPSBudWxsO1xyXG5cdFx0dmFyIGJ1Y2tldCA9IG51bGw7XHJcblx0XHRpZiAoXCJjb3JyZWN0XCIgaW4gdGhlUSl7XHJcblx0XHRcdGlmICh0aGVRLmNvcnJlY3QgIT0gbnVsbCl7XHJcblx0XHRcdFx0aWYgKHRoZVEuY29ycmVjdCA9PSBhbnMuYW5zd2VyTmFtZSl7XHJcblx0XHRcdFx0XHRpc2NvcnJlY3QgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNle1xyXG5cdFx0XHRcdFx0aXNjb3JyZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoXCJidWNrZXRcIiBpbiB0aGVRKXtcclxuXHRcdFx0YnVja2V0ID0gdGhlUS5idWNrZXQ7XHJcblx0XHR9XHJcblx0XHR2YXIgZXZlbnRTdHJpbmcgPSBcInVzZXIgXCIgKyBBbmFseXRpY3NFdmVudHMudXVpZCArIFwiIGFuc3dlcmVkIFwiICsgdGhlUS5xTmFtZSArIFwiIHdpdGggXCIgKyBhbnMuYW5zd2VyTmFtZTtcclxuXHRcdGV2ZW50U3RyaW5nICs9IFwiLCBhbGwgYW5zd2VycyB3ZXJlIFtcIjtcclxuXHRcdHZhciBvcHRzID0gXCJcIjtcclxuXHRcdGZvciAodmFyIGFOdW0gaW4gdGhlUS5hbnN3ZXJzKSB7XHJcblx0XHRcdGV2ZW50U3RyaW5nICs9IHRoZVEuYW5zd2Vyc1thTnVtXS5hbnN3ZXJOYW1lICsgXCIsXCI7XHJcblx0XHRcdG9wdHMgKz0gdGhlUS5hbnN3ZXJzW2FOdW1dLmFuc3dlck5hbWUgKyBcIixcIjtcclxuXHJcblx0XHR9XHJcblx0XHRldmVudFN0cmluZyArPSBcIl0gXCI7XHJcblx0XHRldmVudFN0cmluZyArPSBpc2NvcnJlY3Q7XHJcblx0XHRldmVudFN0cmluZyArPSBidWNrZXQ7XHJcblx0XHRjb25zb2xlLmxvZyhldmVudFN0cmluZyk7XHJcblx0XHRjb25zb2xlLmxvZyhcIkFuc3dlcmVkIEFwcCBWZXJzaW9uOiBcIiArIEFuYWx5dGljc0V2ZW50cy5hcHBWZXJzaW9uKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiQ29udGVudCBWZXJzaW9uOiBcIiArIEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvbik7XHJcblxyXG5cdFx0bG9nRXZlbnQoQW5hbHl0aWNzRXZlbnRzLmdhbmEsXCJhbnN3ZXJlZFwiLCB7XHJcblx0XHRcdHR5cGU6IFwiYW5zd2VyZWRcIixcclxuXHRcdFx0Y2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxyXG5cdFx0XHR1c2VyU291cmNlOiBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSxcclxuXHRcdFx0bGF0TG9uZzogQW5hbHl0aWNzRXZlbnRzLmpvaW5MYXRMb25nKEFuYWx5dGljc0V2ZW50cy5jbGF0LCBBbmFseXRpY3NFdmVudHMuY2xvbiksXHJcblx0XHRcdC8vIGNpdHk6IGNpdHksXHJcblx0XHRcdC8vIHJlZ2lvbjogcmVnaW9uLFxyXG5cdFx0XHQvLyBjb3VudHJ5OiBjb3VudHJ5LFxyXG5cdFx0XHRhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG5cdFx0XHRsYW5nOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXHJcblx0XHRcdGR0OiBlbGFwc2VkLFxyXG5cdFx0XHRxdWVzdGlvbl9udW1iZXI6IHRoZVEucU51bWJlcixcclxuXHRcdFx0dGFyZ2V0OiB0aGVRLnFUYXJnZXQsXHJcblx0XHRcdHF1ZXN0aW9uOiB0aGVRLnByb21wdFRleHQsXHJcblx0XHRcdHNlbGVjdGVkX2Fuc3dlcjogYW5zLmFuc3dlck5hbWUsXHJcblx0XHRcdGlzY29ycmVjdDogaXNjb3JyZWN0LFxyXG5cdFx0XHRvcHRpb25zOiBvcHRzLFxyXG5cdFx0XHRidWNrZXQ6IGJ1Y2tldCxcclxuXHRcdFx0YXBwVmVyc2lvbjogQW5hbHl0aWNzRXZlbnRzLmFwcFZlcnNpb24sXHJcblx0XHRcdGNvbnRlbnRWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb25cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdC8vIFNlbmQgQnVja2V0XHJcblx0c3RhdGljIHNlbmRCdWNrZXQodGI6IGJ1Y2tldCwgcGFzc2VkOiBib29sZWFuKTogdm9pZCB7XHJcblx0XHR2YXIgYm4gPSB0Yi5idWNrZXRJRDtcclxuXHRcdHZhciBidHJpZWQgPSB0Yi5udW1UcmllZDtcclxuXHRcdHZhciBiY29ycmVjdCA9IHRiLm51bUNvcnJlY3Q7XHJcblx0XHRcclxuXHRcdHZhciBldmVudFN0cmluZyA9IFwidXNlciBcIiArIEFuYWx5dGljc0V2ZW50cy51dWlkICsgXCIgZmluaXNoZWQgdGhlIGJ1Y2tldCBcIiArIGJuICsgXCIgd2l0aCBcIiArIGJjb3JyZWN0ICsgXCIgY29ycmVjdCBhbnN3ZXJzIG91dCBvZiBcIiArIGJ0cmllZCArIFwiIHRyaWVkXCIgKyBcIiBhbmQgcGFzc2VkOiBcIiArIHBhc3NlZDtcclxuXHRcdGNvbnNvbGUubG9nKGV2ZW50U3RyaW5nKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiQnVja2V0IENvbXBsZXRlZCBBcHAgVmVyc2lvbjogXCIgKyBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkNvbnRlbnQgVmVyc2lvbjogXCIgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xyXG5cclxuXHRcdGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLFwiYnVja2V0Q29tcGxldGVkXCIsIHtcclxuXHRcdFx0dHlwZTogXCJidWNrZXRDb21wbGV0ZWRcIixcclxuXHRcdFx0Y2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxyXG5cdFx0XHR1c2VyU291cmNlOiBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSxcclxuXHRcdFx0bGF0TG9uZzogQW5hbHl0aWNzRXZlbnRzLmpvaW5MYXRMb25nKEFuYWx5dGljc0V2ZW50cy5jbGF0LCBBbmFseXRpY3NFdmVudHMuY2xvbiksXHJcblx0XHRcdC8vIGNpdHk6IGNpdHksXHJcblx0XHRcdC8vIHJlZ2lvbjogcmVnaW9uLFxyXG5cdFx0XHQvLyBjb3VudHJ5OiBjb3VudHJ5LFxyXG5cdFx0XHRhcHA6IEFuYWx5dGljc0V2ZW50cy5nZXRBcHBUeXBlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG5cdFx0XHRsYW5nOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTChBbmFseXRpY3NFdmVudHMuZGF0YVVSTCksXHJcblx0XHRcdGJ1Y2tldE51bWJlcjogYm4sXHJcblx0XHRcdG51bWJlclRyaWVkSW5CdWNrZXQ6YnRyaWVkLFxyXG5cdFx0XHRudW1iZXJDb3JyZWN0SW5CdWNrZXQ6YmNvcnJlY3QsXHJcblx0XHRcdHBhc3NlZEJ1Y2tldDogcGFzc2VkLFxyXG5cdFx0XHRhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcclxuXHRcdFx0Y29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBTZW5kIEZpbmlzaGVkXHJcblx0c3RhdGljIHNlbmRGaW5pc2hlZChidWNrZXRzOiBidWNrZXRbXSA9IG51bGwsIGJhc2FsQnVja2V0OiBudW1iZXIsIGNlaWxpbmdCdWNrZXQ6IG51bWJlcik6IHZvaWQge1xyXG5cdFx0bGV0IGV2ZW50U3RyaW5nID0gXCJ1c2VyIFwiICsgQW5hbHl0aWNzRXZlbnRzLnV1aWQgKyBcIiBmaW5pc2hlZCB0aGUgYXNzZXNzbWVudFwiO1xyXG5cdFx0Y29uc29sZS5sb2coZXZlbnRTdHJpbmcpO1xyXG5cclxuXHRcdGxldCBiYXNhbEJ1Y2tldElEID0gQW5hbHl0aWNzRXZlbnRzLmdldEJhc2FsQnVja2V0SUQoYnVja2V0cyk7XHJcblx0XHRsZXQgY2VpbGluZ0J1Y2tldElEID0gQW5hbHl0aWNzRXZlbnRzLmdldENlaWxpbmdCdWNrZXRJRChidWNrZXRzKTtcclxuXHJcblx0XHRpZiAoYmFzYWxCdWNrZXRJRCA9PSAwKSB7XHJcblx0XHRcdGJhc2FsQnVja2V0SUQgPSBjZWlsaW5nQnVja2V0SUQ7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IHNjb3JlID0gQW5hbHl0aWNzRXZlbnRzLmNhbGN1bGF0ZVNjb3JlKGJ1Y2tldHMsIGJhc2FsQnVja2V0SUQpO1xyXG5cdFx0Y29uc3QgbWF4U2NvcmUgPSBidWNrZXRzLmxlbmd0aCAqIDEwMDtcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcIlNlbmRpbmcgY29tcGxldGVkIGV2ZW50XCIpO1xyXG5cdFx0Y29uc29sZS5sb2coXCJTY29yZTogXCIgKyBzY29yZSk7XHJcblx0XHRjb25zb2xlLmxvZyhcIk1heCBTY29yZTogXCIgKyBtYXhTY29yZSk7XHJcblx0XHRjb25zb2xlLmxvZyhcIkJhc2FsIEJ1Y2tldDogXCIgKyBiYXNhbEJ1Y2tldElEKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiQkFTQUwgRlJPTSBBU1NFU1NNRU5UOiBcIiArIGJhc2FsQnVja2V0KTtcclxuXHRcdGNvbnNvbGUubG9nKFwiQ2VpbGluZyBCdWNrZXQ6IFwiICsgY2VpbGluZ0J1Y2tldElEKTtcclxuXHRcdGNvbnNvbGUubG9nKFwiQ0VJTElORyBGUk9NIEFTU0VTU01FTlQ6IFwiICsgY2VpbGluZ0J1Y2tldCk7XHJcblx0XHRjb25zb2xlLmxvZyhcIkNvbXBsZXRlZCBBcHAgVmVyc2lvbjogXCIgKyBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbik7XHJcblx0XHRjb25zb2xlLmxvZyhcIkNvbnRlbnQgVmVyc2lvbjogXCIgKyBBbmFseXRpY3NFdmVudHMuY29udGVudFZlcnNpb24pO1xyXG5cclxuXHRcdEFuYWx5dGljc0V2ZW50cy5zZW5kRGF0YVRvVGhpcmRQYXJ0eShzY29yZSwgQW5hbHl0aWNzRXZlbnRzLnV1aWQpO1xyXG5cclxuXHRcdGxvZ0V2ZW50KEFuYWx5dGljc0V2ZW50cy5nYW5hLFwiY29tcGxldGVkXCIsIHtcclxuXHRcdFx0dHlwZTogXCJjb21wbGV0ZWRcIixcclxuXHRcdFx0Y2xVc2VySWQ6IEFuYWx5dGljc0V2ZW50cy51dWlkLFxyXG5cdFx0XHR1c2VyU291cmNlOiBBbmFseXRpY3NFdmVudHMudXNlclNvdXJjZSxcclxuXHRcdFx0YXBwOiBBbmFseXRpY3NFdmVudHMuZ2V0QXBwVHlwZUZyb21EYXRhVVJMKEFuYWx5dGljc0V2ZW50cy5kYXRhVVJMKSxcclxuXHRcdFx0bGFuZzogQW5hbHl0aWNzRXZlbnRzLmdldEFwcExhbmd1YWdlRnJvbURhdGFVUkwoQW5hbHl0aWNzRXZlbnRzLmRhdGFVUkwpLFxyXG5cdFx0XHRsYXRMb25nOiBBbmFseXRpY3NFdmVudHMuam9pbkxhdExvbmcoQW5hbHl0aWNzRXZlbnRzLmNsYXQsIEFuYWx5dGljc0V2ZW50cy5jbG9uKSxcclxuXHRcdFx0Ly8gY2l0eTogY2l0eSxcclxuXHRcdFx0Ly8gcmVnaW9uOiByZWdpb24sXHJcblx0XHRcdC8vIGNvdW50cnk6IGNvdW50cnksXHJcblx0XHRcdHNjb3JlOiBzY29yZSxcclxuXHRcdFx0bWF4U2NvcmU6IG1heFNjb3JlLFxyXG5cdFx0XHRiYXNhbEJ1Y2tldDogYmFzYWxCdWNrZXRJRCxcclxuXHRcdFx0Y2VpbGluZ0J1Y2tldDogY2VpbGluZ0J1Y2tldElELFxyXG5cdFx0XHRhcHBWZXJzaW9uOiBBbmFseXRpY3NFdmVudHMuYXBwVmVyc2lvbixcclxuXHRcdFx0Y29udGVudFZlcnNpb246IEFuYWx5dGljc0V2ZW50cy5jb250ZW50VmVyc2lvblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgc2VuZERhdGFUb1RoaXJkUGFydHkoc2NvcmU6IG51bWJlciwgdXVpZDogc3RyaW5nKTogdm9pZCB7XHJcblx0XHQvLyBTZW5kIGRhdGEgdG8gdGhlIHRoaXJkIHBhcnR5XHJcblx0XHRjb25zb2xlLmxvZyhcIkF0dGVtcHRpbmcgdG8gc2VuZCBzY29yZSB0byBhIHRoaXJkIHBhcnR5ISBTY29yZTogXCIsIHNjb3JlKTtcclxuXHJcblx0XHQvLyBSZWFkIHRoZSBVUkwgZnJvbSB1dG0gcGFyYW1ldGVyc1xyXG5cdFx0Y29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcclxuXHRcdGNvbnN0IHRhcmdldFBhcnR5VVJMID0gdXJsUGFyYW1zLmdldCgnZW5kcG9pbnQnKTtcclxuXHRcdGNvbnN0IG9yZ2FuaXphdGlvbiA9IHVybFBhcmFtcy5nZXQoJ29yZ2FuaXphdGlvbicpO1xyXG4gICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuXHRcdGlmICghdGFyZ2V0UGFydHlVUkwpIHtcclxuXHRcdFx0Y29uc29sZS5lcnJvcihcIk5vIHRhcmdldCBwYXJ0eSBVUkwgZm91bmQhXCIpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgICBcInVzZXJcIjogdXVpZCxcclxuICAgICAgICAgIFwicGFnZVwiOiBcIjExMTEwODEyMTM2MzYxNVwiLCBcclxuICAgICAgICAgIFwiZXZlbnRcIjogeyBcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiZXh0ZXJuYWxcIiwgXHJcbiAgICAgICAgICAgIFwidmFsdWVcIjogeyAgXHJcbiAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYXNzZXNzbWVudFwiLFxyXG5cdFx0XHQgIFwic3ViVHlwZVwiOiBBbmFseXRpY3NFdmVudHMuYXNzZXNzbWVudFR5cGUsXHJcbiAgICAgICAgICAgICAgXCJzY29yZVwiOiBzY29yZSxcclxuICAgICAgICAgICAgICBcImNvbXBsZXRlZFwiOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkocGF5bG9hZCk7XHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0eGhyLm9wZW4oXCJQT1NUXCIsIHRhcmdldFBhcnR5VVJMLCB0cnVlKTtcclxuXHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcblx0XHJcblx0XHRcdHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKHhoci5zdGF0dXMgPj0gMjAwICYmIHhoci5zdGF0dXMgPCAzMDApIHtcclxuXHRcdFx0XHRcdC8vIFJlcXVlc3Qgd2FzIHN1Y2Nlc3NmdWwsIGhhbmRsZSB0aGUgcmVzcG9uc2UgaGVyZVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJQT1NUIHN1Y2Nlc3MhXCIgKyB4aHIucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gUmVxdWVzdCBmYWlsZWRcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzOiAnICsgeGhyLnN0YXR1cyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFxyXG5cdFx0XHR4aHIuc2VuZChwYXlsb2FkU3RyaW5nKTtcclxuXHRcdH0gY2F0Y2ggKGVycm9yKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBkYXRhIHRvIHRhcmdldCBwYXJ0eTogXCIsIGVycm9yKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHQvLyBDYWxjdWxhdGUgU2NvcmVcclxuXHRzdGF0aWMgY2FsY3VsYXRlU2NvcmUoYnVja2V0czogYnVja2V0W10sIGJhc2FsQnVja2V0SUQ6IG51bWJlcik6IG51bWJlciB7XHJcblx0XHRjb25zb2xlLmxvZyhcIkNhbGN1bGF0aW5nIHNjb3JlXCIpO1xyXG5cdFx0Y29uc29sZS5sb2coYnVja2V0cyk7XHJcblx0XHRcclxuXHRcdGxldCBzY29yZSA9IDA7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJCYXNhbCBCdWNrZXQgSUQ6IFwiICsgYmFzYWxCdWNrZXRJRCk7XHJcblxyXG5cdFx0Ly8gR2V0IHRoZSBudW1jb3JyZWN0IGZyb20gdGhlIGJhc2FsIGJ1Y2tldCBiYXNlZCBvbiBsb29waW5nIHRocm91Z2ggYW5kIGZpbmRpbmcgdGhlIGJ1Y2tldCBpZFxyXG5cdFx0bGV0IG51bUNvcnJlY3QgPSAwO1xyXG5cclxuXHRcdGZvciAoY29uc3QgaW5kZXggaW4gYnVja2V0cykge1xyXG5cdFx0XHRjb25zdCBidWNrZXQgPSBidWNrZXRzW2luZGV4XTtcclxuXHRcdFx0aWYgKGJ1Y2tldC5idWNrZXRJRCA9PSBiYXNhbEJ1Y2tldElEKSB7XHJcblx0XHRcdFx0bnVtQ29ycmVjdCA9IGJ1Y2tldC5udW1Db3JyZWN0O1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJOdW0gQ29ycmVjdDogXCIgKyBudW1Db3JyZWN0LCBcIiBiYXNhbDogXCIgKyBiYXNhbEJ1Y2tldElELCBcIiBidWNrZXRzOiBcIiArIGJ1Y2tldHMubGVuZ3RoKTtcclxuXHRcdFxyXG5cdFx0aWYgKGJhc2FsQnVja2V0SUQgPT09IGJ1Y2tldHMubGVuZ3RoICYmIG51bUNvcnJlY3QgPj0gNCkge1xyXG5cdFx0XHQvLyBJZiB0aGUgdXNlciBoYXMgZW5vdWdoIGNvcnJlY3QgYW5zd2VycyBpbiB0aGUgbGFzdCBidWNrZXQsIGdpdmUgdGhlbSBhIHBlcmZlY3Qgc2NvcmVcclxuXHRcdFx0Y29uc29sZS5sb2coXCJQZXJmZWN0IHNjb3JlXCIpO1xyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIGJ1Y2tldHMubGVuZ3RoICogMTAwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRzY29yZSA9IE1hdGgucm91bmQoKChiYXNhbEJ1Y2tldElEIC0gMSkgKiAxMDApICsgKG51bUNvcnJlY3QgLyA1KSAqIDEwMCkgfCAwO1xyXG5cclxuXHRcdHJldHVybiBzY29yZTtcclxuXHR9XHJcblxyXG5cdC8vIEdldCBCYXNhbCBCdWNrZXQgSURcclxuXHRzdGF0aWMgZ2V0QmFzYWxCdWNrZXRJRChidWNrZXRzOiBidWNrZXRbXSk6IG51bWJlciB7XHJcblx0XHRsZXQgYnVja2V0SUQgPSAwO1xyXG5cdFx0XHJcblx0XHQvLyBTZWxlY3QgdGhlIGxvd2VzdCBidWNrZXRJRCBidWNrZXQgdGhhdCB0aGUgdXNlciBoYXMgZmFpbGVkXHJcblx0XHRmb3IgKGNvbnN0IGluZGV4IGluIGJ1Y2tldHMpIHtcclxuXHRcdFx0Y29uc3QgYnVja2V0ID0gYnVja2V0c1tpbmRleF07XHJcblx0XHRcdGlmIChidWNrZXQudGVzdGVkICYmICFidWNrZXQucGFzc2VkKSB7XHJcblx0XHRcdFx0aWYgKGJ1Y2tldElEID09IDAgfHwgYnVja2V0LmJ1Y2tldElEIDwgYnVja2V0SUQpIHtcclxuXHRcdFx0XHRcdGJ1Y2tldElEID0gYnVja2V0LmJ1Y2tldElEO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBidWNrZXRJRDtcclxuXHR9XHJcblxyXG5cdC8vIEdldCBDZWlsaW5nIEJ1Y2tldCBJRFxyXG5cdHN0YXRpYyBnZXRDZWlsaW5nQnVja2V0SUQoYnVja2V0czogYnVja2V0W10pOiBudW1iZXIge1xyXG5cdFx0bGV0IGJ1Y2tldElEID0gMDtcclxuXHRcdFxyXG5cdFx0Ly8gU2VsZWN0IHRoZSBoaXVnaGVzdCBidWNrZXRJRCBidWNrZXQgdGhhdCB0aGUgdXNlciBoYXMgcGFzc2VkXHJcblx0XHRmb3IgKGNvbnN0IGluZGV4IGluIGJ1Y2tldHMpIHtcclxuXHRcdFx0Y29uc3QgYnVja2V0ID0gYnVja2V0c1tpbmRleF07XHJcblx0XHRcdGlmIChidWNrZXQudGVzdGVkICYmIGJ1Y2tldC5wYXNzZWQpIHtcclxuXHRcdFx0XHRpZiAoYnVja2V0SUQgPT0gMCB8fCBidWNrZXQuYnVja2V0SUQgPiBidWNrZXRJRCkge1xyXG5cdFx0XHRcdFx0YnVja2V0SUQgPSBidWNrZXQuYnVja2V0SUQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIGJ1Y2tldElEO1xyXG5cdH1cclxuXHJcblx0Ly8gSm9pbiBMYXQgTG9uZ1xyXG5cdHN0YXRpYyBqb2luTGF0TG9uZyhsYXQ6IHN0cmluZywgbG9uOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIGxhdCArIFwiLFwiICsgbG9uO1xyXG5cdH1cclxufSIsImltcG9ydCB7IEFwcCB9IGZyb20gJy4vQXBwJztcclxuaW1wb3J0IHsgQW5hbHl0aWNzRXZlbnRzIH0gZnJvbSAnLi9jb21wb25lbnRzL2FuYWx5dGljc0V2ZW50cyc7XHJcbmltcG9ydCB7IFVJQ29udHJvbGxlciB9IGZyb20gJy4vY29tcG9uZW50cy91aUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4vY29tcG9uZW50cy91bml0eUJyaWRnZSc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzZVF1aXoge1xyXG5cdHByb3RlY3RlZCBhcHA6IEFwcDtcclxuXHRwdWJsaWMgZGF0YVVSTDogc3RyaW5nO1xyXG5cdHB1YmxpYyB1bml0eUJyaWRnZTogVW5pdHlCcmlkZ2U7XHJcblx0XHJcblx0cHVibGljIGRldk1vZGVBdmFpbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHRwdWJsaWMgaXNJbkRldk1vZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIGlzQ29ycmVjdExhYmVsU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcblx0cHVibGljIGRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXJJZDogc3RyaW5nID0gXCJkZXZNb2RlTW9kYWxUb2dnbGVCdXR0b25Db250YWluZXJcIjtcclxuXHRwdWJsaWMgZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG5cdHB1YmxpYyBkZXZNb2RlVG9nZ2xlQnV0dG9uSWQ6IHN0cmluZyA9IFwiZGV2TW9kZU1vZGFsVG9nZ2xlQnV0dG9uXCI7XHJcblx0cHVibGljIGRldk1vZGVUb2dnbGVCdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuXHRwdWJsaWMgZGV2TW9kZU1vZGFsSWQ6IHN0cmluZyA9IFwiZGV2TW9kZVNldHRpbmdzTW9kYWxcIjtcclxuXHRwdWJsaWMgZGV2TW9kZVNldHRpbmdzTW9kYWw6IEhUTUxFbGVtZW50O1xyXG5cclxuXHRwdWJsaWMgZGV2TW9kZUJ1Y2tldEdlblNlbGVjdElkOiBzdHJpbmcgPSBcImRldk1vZGVCdWNrZXRHZW5TZWxlY3RcIjtcclxuXHRwdWJsaWMgZGV2TW9kZUJ1Y2tldEdlblNlbGVjdDogSFRNTFNlbGVjdEVsZW1lbnQ7XHJcblxyXG5cdHB1YmxpYyBkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveElkOiBzdHJpbmcgPSBcImRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94XCI7XHJcblx0cHVibGljIGRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuaXNJbkRldk1vZGUgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImxvY2FsaG9zdFwiKSB8fCB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcIjEyNy4wLjAuMVwiKSB8fCB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcyhcImFzc2Vzc21lbnRkZXZcIik7XHJcblx0XHR0aGlzLmRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXJJZCk7XHJcblx0XHR0aGlzLmRldk1vZGVTZXR0aW5nc01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlTW9kYWxJZCk7XHJcblxyXG5cdFx0Ly8gdGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiB7XHJcblx0XHQvLyBcdC8vIEB0cy1pZ25vcmVcclxuXHRcdC8vIFx0Y29uc3QgaWQgPSBldmVudC50YXJnZXQuaWQ7XHJcblx0XHQvLyBcdGlmIChpZCA9PSB0aGlzLmRldk1vZGVNb2RhbElkKSB7XHJcblx0XHQvLyBcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHQvLyBcdFx0dGhpcy50b2dnbGVEZXZNb2RlTW9kYWwoKTtcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gfSk7XHJcblxyXG5cdFx0dGhpcy5kZXZNb2RlQnVja2V0R2VuU2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlQnVja2V0R2VuU2VsZWN0SWQpIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cdFx0dGhpcy5kZXZNb2RlQnVja2V0R2VuU2VsZWN0Lm9uY2hhbmdlID0gKGV2ZW50KSA9PiB7IHRoaXMuaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZShldmVudCkgfTtcclxuXHRcdFxyXG5cdFx0dGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uSWQpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG5cdFx0dGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uLm9uY2xpY2sgPSB0aGlzLnRvZ2dsZURldk1vZGVNb2RhbDtcclxuXHJcblx0XHR0aGlzLmRldk1vZGVDb3JyZWN0TGFiZWxTaG93bkNoZWNrYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveElkKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cdFx0dGhpcy5kZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveC5vbmNoYW5nZSA9ICgpID0+IHsgXHJcblx0XHRcdHRoaXMuaXNDb3JyZWN0TGFiZWxTaG93biA9IHRoaXMuZGV2TW9kZUNvcnJlY3RMYWJlbFNob3duQ2hlY2tib3guY2hlY2tlZDtcclxuXHRcdFx0dGhpcy5oYW5kbGVDb3JyZWN0TGFiZWxTaG93bkNoYW5nZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHRpZiAoIXRoaXMuaXNJbkRldk1vZGUpIHtcclxuXHRcdFx0dGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZGV2TW9kZVRvZ2dsZUJ1dHRvbkNvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIGhpZGVEZXZNb2RlQnV0dG9uKCkge1xyXG5cdFx0dGhpcy5kZXZNb2RlVG9nZ2xlQnV0dG9uQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhYnN0cmFjdCBoYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlKGV2ZW50OiBFdmVudCk6IHZvaWQ7XHJcblx0cHVibGljIGFic3RyYWN0IGhhbmRsZUNvcnJlY3RMYWJlbFNob3duQ2hhbmdlKCk6IHZvaWQ7XHJcblxyXG5cdHB1YmxpYyB0b2dnbGVEZXZNb2RlTW9kYWwgPSAoKSA9PiB7XHJcblx0XHRpZiAodGhpcy5kZXZNb2RlU2V0dGluZ3NNb2RhbC5zdHlsZS5kaXNwbGF5ID09IFwiYmxvY2tcIikge1xyXG5cdFx0XHR0aGlzLmRldk1vZGVTZXR0aW5nc01vZGFsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZGV2TW9kZVNldHRpbmdzTW9kYWwuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBhYnN0cmFjdCBSdW4oYXBwbGluazogQXBwKTogdm9pZDtcclxuXHRwdWJsaWMgYWJzdHJhY3QgVHJ5QW5zd2VyKGFuczogbnVtYmVyLCBlbGFwc2VkOiBudW1iZXIpOiB2b2lkO1xyXG5cdHB1YmxpYyBhYnN0cmFjdCBIYXNRdWVzdGlvbnNMZWZ0KCk6IGJvb2xlYW47XHJcblxyXG5cdHB1YmxpYyBvbkVuZCgpOiB2b2lkIHtcclxuXHRcdC8vIHNlbmRGaW5pc2hlZCgpO1xyXG5cdFx0VUlDb250cm9sbGVyLlNob3dFbmQoKTtcclxuXHRcdHRoaXMuYXBwLnVuaXR5QnJpZGdlLlNlbmRDbG9zZSgpO1xyXG5cdH1cclxufVxyXG4iLCIvL3RoaXMgaXMgd2hlcmUgdGhlIGNvZGUgd2lsbCBnbyBmb3IgbGluZWFybHkgaXRlcmF0aW5nIHRocm91Z2ggdGhlXHJcbi8vcXVlc3Rpb25zIGluIGEgZGF0YS5qc29uIGZpbGUgdGhhdCBpZGVudGlmaWVzIGl0c2VsZiBhcyBhIHN1cnZleVxyXG5cclxuaW1wb3J0IHsgVUlDb250cm9sbGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy91aUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBBdWRpb0NvbnRyb2xsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IHFEYXRhLCBhbnN3ZXJEYXRhIH0gZnJvbSAnLi4vY29tcG9uZW50cy9xdWVzdGlvbkRhdGEnO1xyXG5pbXBvcnQgeyBBbmFseXRpY3NFdmVudHMgfSBmcm9tICcuLi9jb21wb25lbnRzL2FuYWx5dGljc0V2ZW50cydcclxuaW1wb3J0IHsgQXBwIH0gZnJvbSAnLi4vQXBwJztcclxuaW1wb3J0IHsgQmFzZVF1aXogfSBmcm9tICcuLi9CYXNlUXVpeic7XHJcbmltcG9ydCB7IGZldGNoU3VydmV5UXVlc3Rpb25zIH0gZnJvbSAnLi4vY29tcG9uZW50cy9qc29uVXRpbHMnO1xyXG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvdW5pdHlCcmlkZ2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN1cnZleSBleHRlbmRzIEJhc2VRdWl6IHtcclxuXHJcblx0cHVibGljIHF1ZXN0aW9uc0RhdGE6IHFEYXRhW107XHJcblx0cHVibGljIGN1cnJlbnRRdWVzdGlvbkluZGV4OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGRhdGFVUkw6IHN0cmluZywgdW5pdHlCcmlkZ2UpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHRjb25zb2xlLmxvZyhcIlN1cnZleSBpbml0aWFsaXplZFwiKTtcclxuXHJcblx0XHR0aGlzLmRhdGFVUkwgPSBkYXRhVVJMO1xyXG5cdFx0dGhpcy51bml0eUJyaWRnZSA9IHVuaXR5QnJpZGdlO1xyXG5cdFx0dGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleCA9IDA7XHJcblx0XHRVSUNvbnRyb2xsZXIuU2V0QnV0dG9uUHJlc3NBY3Rpb24odGhpcy5UcnlBbnN3ZXIpO1xyXG5cdFx0VUlDb250cm9sbGVyLlNldFN0YXJ0QWN0aW9uKHRoaXMuc3RhcnRTdXJ2ZXkpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGhhbmRsZUJ1Y2tldEdlbk1vZGVDaGFuZ2UgPSAoKSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZyhcIkJ1Y2tldCBHZW4gTW9kZSBDaGFuZ2VkXCIpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGhhbmRsZUNvcnJlY3RMYWJlbFNob3duQ2hhbmdlID0gKCkgPT4ge1xyXG5cdFx0Y29uc29sZS5sb2coXCJDb3JyZWN0IExhYmVsIFNob3duIENoYW5nZWRcIik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgYXN5bmMgUnVuKGFwcDogQXBwKSB7XHJcblx0XHR0aGlzLmFwcCA9IGFwcDtcclxuXHRcdHRoaXMuYnVpbGRRdWVzdGlvbkxpc3QoKS50aGVuKHJlc3VsdCA9PiB7XHJcblx0XHRcdHRoaXMucXVlc3Rpb25zRGF0YSA9IHJlc3VsdDtcclxuXHRcdFx0QXVkaW9Db250cm9sbGVyLlByZXBhcmVBdWRpb0FuZEltYWdlc0ZvclN1cnZleSh0aGlzLnF1ZXN0aW9uc0RhdGEsIHRoaXMuYXBwLkdldERhdGFVUkwoKSk7XHJcblx0XHRcdHRoaXMudW5pdHlCcmlkZ2UuU2VuZExvYWRlZCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhcnRTdXJ2ZXkgPSAoKSA9PntcclxuXHRcdFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5nZXROZXh0UXVlc3Rpb24oKSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgb25RdWVzdGlvbkVuZCA9ICgpID0+IHtcclxuXHRcdFVJQ29udHJvbGxlci5TZXRGZWVkYmFja1Zpc2liaWxlKGZhbHNlKTtcclxuXHJcblx0XHR0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4ICs9IDE7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLkhhc1F1ZXN0aW9uc0xlZnQoKSkge1xyXG5cdFx0XHRcdFVJQ29udHJvbGxlci5SZWFkeUZvck5leHQodGhpcy5nZXROZXh0UXVlc3Rpb24oKSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJUaGVyZSBhcmUgbm8gcXVlc3Rpb25zIGxlZnQuXCIpO1xyXG5cdFx0XHRcdHRoaXMub25FbmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSwgNTAwKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBUcnlBbnN3ZXIgPSAoYW5zd2VyOiBudW1iZXIsIGVsYXBzZWQ6IG51bWJlcikgPT4ge1xyXG5cdFx0QW5hbHl0aWNzRXZlbnRzLnNlbmRBbnN3ZXJlZCh0aGlzLnF1ZXN0aW9uc0RhdGFbdGhpcy5jdXJyZW50UXVlc3Rpb25JbmRleF0sIGFuc3dlciwgZWxhcHNlZClcclxuXHRcdFVJQ29udHJvbGxlci5TZXRGZWVkYmFja1Zpc2liaWxlKHRydWUpO1xyXG5cdFx0VUlDb250cm9sbGVyLkFkZFN0YXIoKTtcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLm9uUXVlc3Rpb25FbmQoKSB9LCAyMDAwKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBidWlsZFF1ZXN0aW9uTGlzdCA9ICgpID0+IHtcclxuXHRcdGNvbnN0IHN1cnZleVF1ZXN0aW9ucyA9IGZldGNoU3VydmV5UXVlc3Rpb25zKHRoaXMuYXBwLmRhdGFVUkwpO1xyXG5cdFx0cmV0dXJuIHN1cnZleVF1ZXN0aW9ucztcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBIYXNRdWVzdGlvbnNMZWZ0KCk6IGJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuY3VycmVudFF1ZXN0aW9uSW5kZXggPD0gKHRoaXMucXVlc3Rpb25zRGF0YS5sZW5ndGggLSAxKTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyBnZXROZXh0UXVlc3Rpb24oKTogcURhdGEge1xyXG5cdFx0dmFyIHF1ZXN0aW9uRGF0YSA9IHRoaXMucXVlc3Rpb25zRGF0YVt0aGlzLmN1cnJlbnRRdWVzdGlvbkluZGV4XTtcclxuXHRcdHJldHVybiBxdWVzdGlvbkRhdGE7XHJcblx0fVxyXG59XHJcbiIsImltcG9ydCB7IGJ1Y2tldCB9IGZyb20gXCIuLi9hc3Nlc3NtZW50L2J1Y2tldERhdGFcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVlTm9kZSB7XHJcbiAgICB2YWx1ZTogbnVtYmVyIHwgYnVja2V0O1xyXG4gICAgbGVmdDogVHJlZU5vZGUgfCBudWxsO1xyXG4gICAgcmlnaHQ6IFRyZWVOb2RlIHwgbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMubGVmdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5yaWdodCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKiBHZW5lcmF0ZXMgYSByYW5kb20gYmluYXJ5IHNlYXJjaCB0cmVlIGZyb20gYVxyXG4gLSBJZiB0aGUgc3RhcnQgYW5kIGVuZCBpbmRpY2VzIGFyZSB0aGUgc2FtZSwgdGhlIGZ1bmN0aW9uIHJldHVybnMgbnVsbFxyXG4gLSBJZiB0aGUgbWlkZGxlIGluZGV4IGlzIGV2ZW4sIHRoZSBmdW5jdGlvbiB1c2VzIHRoZSBleGFjdCBtaWRkbGUgcG9pbnRcclxuIC0gT3RoZXJ3aXNlLCB0aGUgZnVuY3Rpb24gcmFuZG9tbHkgYWRkcyAwIG9yIDEgdG8gdGhlIG1pZGRsZSBpbmRleFxyXG4gLSBSZXR1cm5zIHRoZSByb290IG5vZGUgb2YgdGhlIGdlbmVyYXRlZCBiaW5hcnkgc2VhcmNoIHRyZWUgd2hpY2ggY29udGFpbnMgdGhlIGJ1Y2tldElkcyBpZiBjYWxsZWQgcHJvcGVybHlcclxuIC0gZXg6IGxldCByb290T2ZJZHMgPSBzb3J0ZWRBcnJheVRvQlNUKHRoaXMuYnVja2V0cywgdGhpcy5idWNrZXRzWzBdLmJ1Y2tldElEIC0gMSwgdGhpcy5idWNrZXRzW3RoaXMuYnVja2V0cy5sZW5ndGggLSAxXS5idWNrZXRJRCwgdXNlZEluZGljZXMpO1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRlZEFycmF5VG9JRHNCU1Qoc3RhcnQsIGVuZCwgdXNlZEluZGljZXMpIHtcclxuICAgIGlmIChzdGFydCA+IGVuZCkgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgLy8gUmFuZG9taXplIG1pZGRsZSBwb2ludCB3aXRoaW4gdW51c2VkIGluZGljZXNcclxuICAgIGxldCBtaWQ7XHJcblxyXG4gICAgaWYgKChzdGFydCArIGVuZCkgJSAyID09PSAwICYmIHVzZWRJbmRpY2VzLnNpemUgIT09IDEpIHtcclxuICAgICAgICBtaWQgPSBNYXRoLmZsb29yKChzdGFydCArIGVuZCkgLyAyKTsgLy8gVXNlIHRoZSBleGFjdCBtaWRkbGUgcG9pbnRcclxuICAgICAgICBpZiAobWlkID09PSAwKSByZXR1cm4gbnVsbDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBtaWQgPSBNYXRoLmZsb29yKChzdGFydCArIGVuZCkgLyAyKTtcclxuICAgICAgICAgICAgbWlkICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpOyAvLyBSYW5kb21seSBhZGQgMCBvciAxIHRvIG1pZFxyXG4gICAgICAgIH0gd2hpbGUgKG1pZCA+IGVuZCB8fCB1c2VkSW5kaWNlcy5oYXMobWlkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXNlZEluZGljZXMuYWRkKG1pZCk7XHJcbiAgICBcclxuICAgIGxldCBub2RlID0gbmV3IFRyZWVOb2RlKG1pZCk7XHJcblxyXG4gICAgbm9kZS5sZWZ0ID0gc29ydGVkQXJyYXlUb0lEc0JTVChzdGFydCwgbWlkIC0gMSwgdXNlZEluZGljZXMpO1xyXG4gICAgbm9kZS5yaWdodCA9IHNvcnRlZEFycmF5VG9JRHNCU1QobWlkICsgMSwgZW5kLCB1c2VkSW5kaWNlcyk7XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuIiwiLy90aGlzIGlzIHdoZXJlIHRoZSBsb2dpYyBmb3IgaGFuZGxpbmcgdGhlIGJ1Y2tldHMgd2lsbCBnb1xyXG4vL1xyXG4vL29uY2Ugd2Ugc3RhcnQgYWRkaW5nIGluIHRoZSBhc3Nlc3NtZW50IGZ1bmN0aW9uYWxpdHlcclxuaW1wb3J0IHsgVUlDb250cm9sbGVyIH0gZnJvbSAnLi4vY29tcG9uZW50cy91aUNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBxRGF0YSwgYW5zd2VyRGF0YSB9IGZyb20gJy4uL2NvbXBvbmVudHMvcXVlc3Rpb25EYXRhJztcclxuaW1wb3J0IHsgQW5hbHl0aWNzRXZlbnRzIH0gZnJvbSAnLi4vY29tcG9uZW50cy9hbmFseXRpY3NFdmVudHMnXHJcbmltcG9ydCB7IEFwcCB9IGZyb20gJy4uL0FwcCc7XHJcbmltcG9ydCB7IGJ1Y2tldCwgYnVja2V0SXRlbSB9IGZyb20gJy4vYnVja2V0RGF0YSc7XHJcbmltcG9ydCB7IEJhc2VRdWl6IH0gZnJvbSAnLi4vQmFzZVF1aXonO1xyXG5pbXBvcnQgeyBmZXRjaEFzc2Vzc21lbnRCdWNrZXRzIH0gZnJvbSAnLi4vY29tcG9uZW50cy9qc29uVXRpbHMnO1xyXG5pbXBvcnQgeyBUcmVlTm9kZSwgc29ydGVkQXJyYXlUb0lEc0JTVCB9IGZyb20gJy4uL2NvbXBvbmVudHMvdE5vZGUnO1xyXG5pbXBvcnQgeyByYW5kRnJvbSwgc2h1ZmZsZUFycmF5IH0gZnJvbSAnLi4vY29tcG9uZW50cy9tYXRoVXRpbHMnO1xyXG5pbXBvcnQgeyBBdWRpb0NvbnRyb2xsZXIgfSBmcm9tICcuLi9jb21wb25lbnRzL2F1ZGlvQ29udHJvbGxlcic7XHJcblxyXG5lbnVtIHNlYXJjaFN0YWdlIHtcclxuXHRCaW5hcnlTZWFyY2gsXHJcblx0TGluZWFyU2VhcmNoVXAsXHJcblx0TGluZWFyU2VhcmNoRG93blxyXG59XHJcblxyXG5lbnVtIEJ1Y2tldEdlbk1vZGUge1xyXG5cdFJhbmRvbUJTVCxcclxuXHRMaW5lYXJBcnJheUJhc2VkLFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXNzZXNzbWVudCBleHRlbmRzIEJhc2VRdWl6IHtcclxuXHJcblx0cHVibGljIHVuaXR5QnJpZGdlO1xyXG5cclxuXHRwdWJsaWMgY3VycmVudE5vZGU6IFRyZWVOb2RlO1xyXG5cdHB1YmxpYyBjdXJyZW50UXVlc3Rpb246IHFEYXRhO1xyXG5cdHB1YmxpYyBidWNrZXRBcnJheTogbnVtYmVyW107XHJcblx0cHVibGljIHF1ZXN0aW9uTnVtYmVyOiBudW1iZXI7XHJcblx0XHJcblx0cHVibGljIGJ1Y2tldHM6IGJ1Y2tldFtdO1xyXG5cdHB1YmxpYyBjdXJyZW50QnVja2V0OiBidWNrZXQ7XHJcblx0cHVibGljIG51bUJ1Y2tldHM6IG51bWJlcjtcclxuXHRwdWJsaWMgYmFzYWxCdWNrZXQ6IG51bWJlcjtcclxuXHRwdWJsaWMgY2VpbGluZ0J1Y2tldDogbnVtYmVyO1xyXG5cclxuXHRwdWJsaWMgY3VycmVudExpbmVhckJ1Y2tldEluZGV4OiBudW1iZXI7XHJcblx0cHVibGljIGN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleDogbnVtYmVyO1xyXG5cclxuXHRwcm90ZWN0ZWQgYnVja2V0R2VuTW9kZTogQnVja2V0R2VuTW9kZSA9IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUO1xyXG5cclxuXHRwcml2YXRlIE1BWF9TVEFSU19DT1VOVF9JTl9MSU5FQVJfTU9ERSA9IDIwO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihkYXRhVVJMOiBzdHJpbmcsIHVuaXR5QnJpZGdlOiBhbnkpIHtcclxuXHRcdHN1cGVyKCk7XHJcblx0XHR0aGlzLmRhdGFVUkwgPSBkYXRhVVJMO1xyXG5cdFx0dGhpcy51bml0eUJyaWRnZSA9IHVuaXR5QnJpZGdlO1xyXG5cdFx0dGhpcy5xdWVzdGlvbk51bWJlciA9IDA7XHJcblx0XHRjb25zb2xlLmxvZyhcImFwcCBpbml0aWFsaXplZFwiKTtcclxuXHRcdFVJQ29udHJvbGxlci5TZXRCdXR0b25QcmVzc0FjdGlvbih0aGlzLlRyeUFuc3dlcik7XHJcblx0XHRVSUNvbnRyb2xsZXIuU2V0U3RhcnRBY3Rpb24odGhpcy5zdGFydEFzc2Vzc21lbnQpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIFJ1bihhcHBsaW5rOiBBcHApOiB2b2lkIHtcclxuXHRcdHRoaXMuYXBwID0gYXBwbGluaztcclxuXHRcdHRoaXMuYnVpbGRCdWNrZXRzKHRoaXMuYnVja2V0R2VuTW9kZSkudGhlbihyZXN1bHQgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLmN1cnJlbnRCdWNrZXQpO1xyXG5cdFx0XHR0aGlzLnVuaXR5QnJpZGdlLlNlbmRMb2FkZWQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGhhbmRsZUJ1Y2tldEdlbk1vZGVDaGFuZ2UoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcblx0XHQvLyBUT0RPOiBJbXBsZW1lbnQgaGFuZGxlQnVja2V0R2VuTW9kZUNoYW5nZVxyXG5cdFx0dGhpcy5idWNrZXRHZW5Nb2RlID0gcGFyc2VJbnQodGhpcy5kZXZNb2RlQnVja2V0R2VuU2VsZWN0LnZhbHVlKSBhcyBCdWNrZXRHZW5Nb2RlO1xyXG5cdFx0dGhpcy5idWlsZEJ1Y2tldHModGhpcy5idWNrZXRHZW5Nb2RlKS50aGVuKCgpID0+IHtcclxuXHRcdFx0Ly8gRmluaXNoZWQgYnVpbGRpbmcgYnVja2V0c1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaGFuZGxlQ29ycmVjdExhYmVsU2hvd25DaGFuZ2UoKTogdm9pZCB7XHJcblx0XHRVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5TZXRDb3JyZWN0TGFiZWxWaXNpYmlsaXR5KHRoaXMuaXNDb3JyZWN0TGFiZWxTaG93bik7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgc3RhcnRBc3Nlc3NtZW50ID0gKCkgPT4ge1xyXG5cdFx0VUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmdldE5leHRRdWVzdGlvbigpKTtcclxuXHRcdGlmICh0aGlzLmlzSW5EZXZNb2RlKSB7XHJcblx0XHRcdHRoaXMuaGlkZURldk1vZGVCdXR0b24oKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBidWlsZEJ1Y2tldHMgPSBhc3luYyAoYnVja2V0R2VuTW9kZTogQnVja2V0R2VuTW9kZSkgPT4ge1xyXG5cdFx0Ly8gSWYgd2UgZG9uJ3QgaGF2ZSB0aGUgYnVja2V0cyBsb2FkZWQsIGxvYWQgdGhlbSBhbmQgaW5pdGlhbGl6ZSB0aGUgY3VycmVudCBub2RlLCB3aGljaCBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcclxuXHRcdGlmICh0aGlzLmJ1Y2tldHMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLmJ1Y2tldHMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHZhciByZXMgPSBmZXRjaEFzc2Vzc21lbnRCdWNrZXRzKHRoaXMuYXBwLkdldERhdGFVUkwoKSkudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0dGhpcy5idWNrZXRzID0gcmVzdWx0O1xyXG5cdFx0XHRcdHRoaXMubnVtQnVja2V0cyA9IHJlc3VsdC5sZW5ndGg7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJidWNrZXRzOiBcIiArIHRoaXMuYnVja2V0cyk7XHJcblx0XHRcdFx0dGhpcy5idWNrZXRBcnJheSA9IEFycmF5LmZyb20oQXJyYXkodGhpcy5udW1CdWNrZXRzKSwgKF8sIGkpID0+IGkrMSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJlbXB0eSBhcnJheSBcIiArICB0aGlzLmJ1Y2tldEFycmF5KTtcclxuXHRcdFx0XHRsZXQgdXNlZEluZGljZXMgPSBuZXcgU2V0PG51bWJlcj4oKTtcclxuXHRcdFx0XHR1c2VkSW5kaWNlcy5hZGQoMCk7XHJcblx0XHRcdFx0bGV0IHJvb3RPZklEcyA9IHNvcnRlZEFycmF5VG9JRHNCU1QodGhpcy5idWNrZXRzWzBdLmJ1Y2tldElEIC0gMSwgdGhpcy5idWNrZXRzW3RoaXMuYnVja2V0cy5sZW5ndGggLSAxXS5idWNrZXRJRCwgdXNlZEluZGljZXMpO1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKFwiR2VuZXJhdGVkIHRoZSBidWNrZXRzIHJvb3QgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyb290T2ZJRHMpO1xyXG5cdFx0XHRcdGxldCBidWNrZXRzUm9vdCA9IHRoaXMuY29udmVydFRvQnVja2V0QlNUKHJvb3RPZklEcywgdGhpcy5idWNrZXRzKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkdlbmVyYXRlZCB0aGUgYnVja2V0cyByb290IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYnVja2V0c1Jvb3QpO1xyXG5cdFx0XHRcdHRoaXMuYmFzYWxCdWNrZXQgPSB0aGlzLm51bUJ1Y2tldHMgKyAxO1xyXG5cdFx0XHRcdHRoaXMuY2VpbGluZ0J1Y2tldCA9IC0xO1xyXG5cdFx0XHRcdHRoaXMuY3VycmVudE5vZGUgPSBidWNrZXRzUm9vdDtcclxuXHRcdFx0XHR0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIHJlcztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChidWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG5cdFx0XHRcdC8vIElmIHdlIGhhdmUgdGhlIGJ1Y2tldHMgbG9hZGVkLCB3ZSBjYW4gaW5pdGlhbGl6ZSB0aGUgY3VycmVudCBub2RlLCB3aGljaCBpcyB0aGUgc3RhcnRpbmcgcG9pbnRcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IHVzZWRJbmRpY2VzID0gbmV3IFNldDxudW1iZXI+KCk7XHJcblx0XHRcdFx0XHR1c2VkSW5kaWNlcy5hZGQoMCk7XHJcblx0XHRcdFx0XHRsZXQgcm9vdE9mSURzID0gc29ydGVkQXJyYXlUb0lEc0JTVCh0aGlzLmJ1Y2tldHNbMF0uYnVja2V0SUQgLSAxLCB0aGlzLmJ1Y2tldHNbdGhpcy5idWNrZXRzLmxlbmd0aCAtIDFdLmJ1Y2tldElELCB1c2VkSW5kaWNlcyk7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhcIkdlbmVyYXRlZCB0aGUgYnVja2V0cyByb290IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZyhyb290T2ZJRHMpO1xyXG5cdFx0XHRcdFx0bGV0IGJ1Y2tldHNSb290ID0gdGhpcy5jb252ZXJ0VG9CdWNrZXRCU1Qocm9vdE9mSURzLCB0aGlzLmJ1Y2tldHMpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJHZW5lcmF0ZWQgdGhlIGJ1Y2tldHMgcm9vdCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYnVja2V0c1Jvb3QpO1xyXG5cdFx0XHRcdFx0dGhpcy5iYXNhbEJ1Y2tldCA9IHRoaXMubnVtQnVja2V0cyArIDE7XHJcblx0XHRcdFx0XHR0aGlzLmNlaWxpbmdCdWNrZXQgPSAtMTtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudE5vZGUgPSBidWNrZXRzUm9vdDtcclxuXHRcdFx0XHRcdHRoaXMudHJ5TW92ZUJ1Y2tldChmYWxzZSk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4ID0gMDtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4ID0gMDtcclxuXHRcdFx0XHRcdHRoaXMudHJ5TW92ZUJ1Y2tldChmYWxzZSk7XHJcblx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENvbnZlcnRzIGEgYmluYXJ5IHNlYXJjaCB0cmVlIG9mIG51bWJlcnMgdG8gYSBiaW5hcnkgc2VhcmNoIHRyZWUgb2YgYnVja2V0IG9iamVjdHNcclxuXHQgKiBAcGFyYW0gbm9kZSBJcyBhIHJvb3Qgbm9kZSBvZiBhIGJpbmFyeSBzZWFyY2ggdHJlZVxyXG5cdCAqIEBwYXJhbSBidWNrZXRzIElzIGFuIGFycmF5IG9mIGJ1Y2tldCBvYmplY3RzXHJcblx0ICogQHJldHVybnMgQSByb290IG5vZGUgb2YgYSBiaW5hcnkgc2VhcmNoIHRyZWUgd2hlcmUgdGhlIHZhbHVlIG9mIGVhY2ggbm9kZSBpcyBhIGJ1Y2tldCBvYmplY3RcclxuXHQgKi9cclxuXHRwdWJsaWMgY29udmVydFRvQnVja2V0QlNUID0gKG5vZGU6IFRyZWVOb2RlLCBidWNrZXRzOiBidWNrZXRbXSkgPT4ge1xyXG5cdFx0Ly8gVHJhdmVyc2UgZWFjaCBlbGVtZW50IHRha2UgdGhlIHZhbHVlIGFuZCBmaW5kIHRoYXQgYnVja2V0IGluIHRoZSBidWNrZXRzIGFycmF5IGFuZCBhc3NpZ24gdGhhdCBidWNrZXQgaW5zdGVhZCBvZiB0aGUgbnVtYmVyIHZhbHVlXHJcblx0XHRpZiAobm9kZSA9PT0gbnVsbCkgcmV0dXJuIG5vZGU7XHJcblxyXG5cdFx0bGV0IGJ1Y2tldElkID0gbm9kZS52YWx1ZTtcclxuXHRcdG5vZGUudmFsdWUgPSBidWNrZXRzLmZpbmQoYnVja2V0ID0+IGJ1Y2tldC5idWNrZXRJRCA9PT0gYnVja2V0SWQpO1xyXG5cdFx0aWYgKG5vZGUubGVmdCAhPT0gbnVsbCkgbm9kZS5sZWZ0ID0gdGhpcy5jb252ZXJ0VG9CdWNrZXRCU1Qobm9kZS5sZWZ0LCBidWNrZXRzKTtcclxuXHRcdGlmIChub2RlLnJpZ2h0ICE9PSBudWxsKSBub2RlLnJpZ2h0ID0gdGhpcy5jb252ZXJ0VG9CdWNrZXRCU1Qobm9kZS5yaWdodCwgYnVja2V0cyk7XHJcblxyXG5cdFx0cmV0dXJuIG5vZGU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW5pdEJ1Y2tldCA9IChidWNrZXQ6IGJ1Y2tldCkgPT4ge1xyXG5cdFx0dGhpcy5jdXJyZW50QnVja2V0ID0gYnVja2V0O1xyXG5cdFx0dGhpcy5jdXJyZW50QnVja2V0LnVzZWRJdGVtcyA9IFtdO1xyXG5cdFx0dGhpcy5jdXJyZW50QnVja2V0Lm51bVRyaWVkID0gMDtcclxuXHRcdHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db3JyZWN0ID0gMDtcclxuXHRcdHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nID0gMDtcclxuXHRcdHRoaXMuY3VycmVudEJ1Y2tldC50ZXN0ZWQgPSB0cnVlO1xyXG5cdFx0dGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIFRyeUFuc3dlciA9IChhbnN3ZXI6IG51bWJlciwgZWxhcHNlZDogbnVtYmVyKSA9PiB7XHJcblx0XHRpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG5cdFx0XHRBbmFseXRpY3NFdmVudHMuc2VuZEFuc3dlcmVkKHRoaXMuY3VycmVudFF1ZXN0aW9uLCBhbnN3ZXIsIGVsYXBzZWQpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5jdXJyZW50QnVja2V0Lm51bVRyaWVkICs9IDE7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50UXVlc3Rpb24uYW5zd2Vyc1thbnN3ZXIgLSAxXS5hbnN3ZXJOYW1lID09IHRoaXMuY3VycmVudFF1ZXN0aW9uLmNvcnJlY3Qpe1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29ycmVjdCArPSAxO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA9IDA7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQW5zd2VyZWQgY29ycmVjdGx5XCIpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdHRoaXMuY3VycmVudEJ1Y2tldC5udW1Db25zZWN1dGl2ZVdyb25nICs9IDE7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiQW5zd2VyZWQgaW5jb3JyZWN0bHksIFwiICsgdGhpcy5jdXJyZW50QnVja2V0Lm51bUNvbnNlY3V0aXZlV3JvbmcpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkICYmIFVJQ29udHJvbGxlci5nZXRJbnN0YW5jZSgpLnNob3duU3RhcnNDb3VudCA8IHRoaXMuTUFYX1NUQVJTX0NPVU5UX0lOX0xJTkVBUl9NT0RFKSB7XHJcblx0XHRcdFVJQ29udHJvbGxlci5BZGRTdGFyKCk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcclxuXHRcdFx0VUlDb250cm9sbGVyLkFkZFN0YXIoKTtcclxuXHRcdH1cclxuXHRcdFVJQ29udHJvbGxlci5TZXRGZWVkYmFja1Zpc2liaWxlKHRydWUpO1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7IFxyXG5cdFx0XHRjb25zb2xlLmxvZygnQ29tcGxldGVkIGZpcnN0IFRpbWVvdXQnKTtcclxuXHRcdFx0dGhpcy5vblF1ZXN0aW9uRW5kKClcclxuXHRcdH0sIDIwMDApO1xyXG5cdH1cclxuXHJcblx0cHVibGljIG9uUXVlc3Rpb25FbmQgPSAoKSA9PiB7XHJcblx0XHRsZXQgcXVlc3Rpb25FbmRUaW1lb3V0ID0gKHRoaXMuSGFzUXVlc3Rpb25zTGVmdCgpKSA/IDUwMCA6IDQwMDA7XHJcblx0XHJcblx0XHRjb25zdCBlbmRPcGVyYXRpb25zID0gKCkgPT4ge1xyXG5cdFx0XHRVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tWaXNpYmlsZShmYWxzZSk7XHJcblx0XHRcdGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuTGluZWFyQXJyYXlCYXNlZCAmJiBVSUNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKS5zaG93blN0YXJzQ291bnQgPCB0aGlzLk1BWF9TVEFSU19DT1VOVF9JTl9MSU5FQVJfTU9ERSkge1xyXG5cdFx0XHRcdFVJQ29udHJvbGxlci5DaGFuZ2VTdGFySW1hZ2VBZnRlckFuaW1hdGlvbigpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcclxuXHRcdFx0XHRVSUNvbnRyb2xsZXIuQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24oKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGhpcy5IYXNRdWVzdGlvbnNMZWZ0KCkpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLkxpbmVhckFycmF5QmFzZWQpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA8IHRoaXMuYnVja2V0c1t0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleF0uaXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4Kys7XHJcblx0XHRcdFx0XHRcdC8vIFdlIG5lZWQgdG8gcmVzZXQgdGhlIHVzZWQgaXRlbXMgYXJyYXkgd2hlbiB3ZSBtb3ZlIHRvIHRoZSBuZXh0IHF1ZXN0aW9uIGluIGxpbmVhciBtb2RlXHJcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMgPSBbXTtcclxuXHRcdFx0XHRcdH0gXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmICh0aGlzLmN1cnJlbnRMaW5lYXJUYXJnZXRJbmRleCA+PSB0aGlzLmJ1Y2tldHNbdGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXhdLml0ZW1zLmxlbmd0aCAmJiB0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA8IHRoaXMuYnVja2V0cy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgrKztcclxuXHRcdFx0XHRcdFx0dGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXggPSAwO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnRyeU1vdmVCdWNrZXQoZmFsc2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0VUlDb250cm9sbGVyLlJlYWR5Rm9yTmV4dCh0aGlzLmdldE5leHRRdWVzdGlvbigpKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIk5vIHF1ZXN0aW9ucyBsZWZ0XCIpO1xyXG5cdFx0XHRcdHRoaXMub25FbmQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcclxuXHRcdC8vIENyZWF0ZSBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBhZnRlciB0aGUgc3BlY2lmaWVkIHRpbWVvdXRcclxuXHRcdGNvbnN0IHRpbWVvdXRQcm9taXNlID0gbmV3IFByb21pc2U8dm9pZD4ocmVzb2x2ZSA9PiB7XHJcblx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fSwgcXVlc3Rpb25FbmRUaW1lb3V0KTtcclxuXHRcdH0pO1xyXG5cdFxyXG5cdFx0Ly8gRXhlY3V0ZSBlbmRPcGVyYXRpb25zIGFmdGVyIHRpbWVvdXRQcm9taXNlIHJlc29sdmVzXHJcblx0XHR0aW1lb3V0UHJvbWlzZS50aGVuKCgpID0+IHtcclxuXHRcdFx0ZW5kT3BlcmF0aW9ucygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cclxuXHRwdWJsaWMgZ2V0TmV4dFF1ZXN0aW9uID0gKCkgPT4ge1xyXG5cdFx0aWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkICYmIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4ID49IHRoaXMuYnVja2V0c1t0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleF0uaXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHRhcmdldEl0ZW0sIGZvaWwxLCBmb2lsMiwgZm9pbDM7XHJcblxyXG5cdFx0aWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5SYW5kb21CU1QpIHtcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdHRhcmdldEl0ZW0gPSByYW5kRnJvbSh0aGlzLmN1cnJlbnRCdWNrZXQuaXRlbXMpO1xyXG5cdFx0XHR9IHdoaWxlICh0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zLmluY2x1ZGVzKHRhcmdldEl0ZW0pKTtcclxuXHJcblx0XHRcdHRoaXMuY3VycmVudEJ1Y2tldC51c2VkSXRlbXMucHVzaCh0YXJnZXRJdGVtKTtcclxuXHJcblx0XHRcdGRvIHtcclxuXHRcdFx0XHRmb2lsMSA9IHJhbmRGcm9tKHRoaXMuY3VycmVudEJ1Y2tldC5pdGVtcyk7XHJcblx0XHRcdH0gd2hpbGUgKHRhcmdldEl0ZW0gPT0gZm9pbDEpO1xyXG5cclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGZvaWwyID0gcmFuZEZyb20odGhpcy5jdXJyZW50QnVja2V0Lml0ZW1zKTtcclxuXHRcdFx0fSB3aGlsZSAodGFyZ2V0SXRlbSA9PSBmb2lsMiB8fCBmb2lsMSA9PSBmb2lsMik7XHJcblxyXG5cdFx0XHRkbyB7XHJcblx0XHRcdFx0Zm9pbDMgPSByYW5kRnJvbSh0aGlzLmN1cnJlbnRCdWNrZXQuaXRlbXMpO1xyXG5cdFx0XHR9IHdoaWxlICh0YXJnZXRJdGVtID09IGZvaWwzIHx8IGZvaWwxID09IGZvaWwzIHx8IGZvaWwyID09IGZvaWwzKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XHJcblx0XHRcdC8vIExpbmVhckFycmF5QmFzZWRcclxuXHRcdFx0dGFyZ2V0SXRlbSA9IHRoaXMuYnVja2V0c1t0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleF0uaXRlbXNbdGhpcy5jdXJyZW50TGluZWFyVGFyZ2V0SW5kZXhdO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRCdWNrZXQudXNlZEl0ZW1zLnB1c2godGFyZ2V0SXRlbSk7XHJcblxyXG5cdFx0XHQvLyBHZW5lcmF0ZSByYW5kb20gZm9pbHNcclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGZvaWwxID0gcmFuZEZyb20odGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcyk7XHJcblx0XHRcdH0gd2hpbGUgKHRhcmdldEl0ZW0gPT0gZm9pbDEpO1xyXG5cclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGZvaWwyID0gcmFuZEZyb20odGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcyk7XHJcblx0XHRcdH0gd2hpbGUgKHRhcmdldEl0ZW0gPT0gZm9pbDIgfHwgZm9pbDEgPT0gZm9pbDIpO1xyXG5cclxuXHRcdFx0ZG8ge1xyXG5cdFx0XHRcdGZvaWwzID0gcmFuZEZyb20odGhpcy5idWNrZXRzW3RoaXMuY3VycmVudExpbmVhckJ1Y2tldEluZGV4XS5pdGVtcyk7XHJcblx0XHRcdH0gd2hpbGUgKHRhcmdldEl0ZW0gPT0gZm9pbDMgfHwgZm9pbDEgPT0gZm9pbDMgfHwgZm9pbDIgPT0gZm9pbDMpO1xyXG5cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0bGV0IGFuc3dlck9wdGlvbnMgPSBbdGFyZ2V0SXRlbSwgZm9pbDEsIGZvaWwyLCBmb2lsM107XHJcblx0XHRzaHVmZmxlQXJyYXkoYW5zd2VyT3B0aW9ucyk7XHJcblxyXG5cdFx0dmFyIHJlc3VsdCA9IHtcclxuXHRcdFx0cU5hbWU6IFwicXVlc3Rpb24tXCIgKyB0aGlzLnF1ZXN0aW9uTnVtYmVyICsgXCItXCIgKyB0YXJnZXRJdGVtLml0ZW1OYW1lLFxyXG5cdFx0XHRxTnVtYmVyOiB0aGlzLnF1ZXN0aW9uTnVtYmVyLFxyXG5cdFx0XHRxVGFyZ2V0OiB0YXJnZXRJdGVtLml0ZW1OYW1lLFxyXG5cdFx0XHRwcm9tcHRUZXh0OiBcIlwiLFxyXG5cdFx0XHRidWNrZXQ6IHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCxcclxuXHRcdFx0cHJvbXB0QXVkaW86IHRhcmdldEl0ZW0uaXRlbU5hbWUsXHJcblx0XHRcdGNvcnJlY3Q6IHRhcmdldEl0ZW0uaXRlbVRleHQsXHJcblx0XHRcdGFuc3dlcnM6IFtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRhbnN3ZXJOYW1lOiBhbnN3ZXJPcHRpb25zWzBdLml0ZW1OYW1lLFxyXG5cdFx0XHRcdFx0YW5zd2VyVGV4dDogYW5zd2VyT3B0aW9uc1swXS5pdGVtVGV4dFxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YW5zd2VyTmFtZTogYW5zd2VyT3B0aW9uc1sxXS5pdGVtTmFtZSxcclxuXHRcdFx0XHRcdGFuc3dlclRleHQ6IGFuc3dlck9wdGlvbnNbMV0uaXRlbVRleHRcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGFuc3dlck5hbWU6IGFuc3dlck9wdGlvbnNbMl0uaXRlbU5hbWUsXHJcblx0XHRcdFx0XHRhbnN3ZXJUZXh0OiBhbnN3ZXJPcHRpb25zWzJdLml0ZW1UZXh0XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRhbnN3ZXJOYW1lOiBhbnN3ZXJPcHRpb25zWzNdLml0ZW1OYW1lLFxyXG5cdFx0XHRcdFx0YW5zd2VyVGV4dDogYW5zd2VyT3B0aW9uc1szXS5pdGVtVGV4dFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmN1cnJlbnRRdWVzdGlvbiA9IHJlc3VsdDtcclxuXHRcdHRoaXMucXVlc3Rpb25OdW1iZXIgKz0gMTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdHJ5TW92ZUJ1Y2tldCA9IChwYXNzZWQ6IGJvb2xlYW4pID0+IHtcclxuXHRcdGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcblx0XHRcdHRoaXMudHJ5TW92ZUJ1Y2tldFJhbmRvbUJTVChwYXNzZWQpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuTGluZWFyQXJyYXlCYXNlZCkge1xyXG5cdFx0XHR0aGlzLnRyeU1vdmVCdWNrZXRMaW5lYXJBcnJheUJhc2VkKHBhc3NlZCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgdHJ5TW92ZUJ1Y2tldFJhbmRvbUJTVCA9IChwYXNzZWQ6IGJvb2xlYW4pID0+IHtcclxuXHRcdGNvbnN0IG5ld0J1Y2tldCA9ICh0aGlzLmN1cnJlbnROb2RlLnZhbHVlIGFzIGJ1Y2tldCk7XHJcblx0XHRpZiAodGhpcy5jdXJyZW50QnVja2V0ICE9IG51bGwpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IHBhc3NlZDtcclxuXHRcdFx0QW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCBwYXNzZWQpO1xyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coXCJuZXcgIGJ1Y2tldCBpcyBcIiArIG5ld0J1Y2tldC5idWNrZXRJRCk7XHJcblx0XHRBdWRpb0NvbnRyb2xsZXIuUHJlbG9hZEJ1Y2tldChuZXdCdWNrZXQsIHRoaXMuYXBwLkdldERhdGFVUkwoKSk7XHJcblx0XHR0aGlzLmluaXRCdWNrZXQobmV3QnVja2V0KTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyB0cnlNb3ZlQnVja2V0TGluZWFyQXJyYXlCYXNlZCA9IChwYXNzZWQ6IGJvb2xlYW4pID0+IHtcclxuXHRcdGNvbnN0IG5ld0J1Y2tldCA9IHRoaXMuYnVja2V0c1t0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleF07XHJcblx0XHQvLyBBdm9pZCBwYXNzaW5nIGJ1Y2tldFBhc3NlZCBldmVudCB0byB0aGUgYW5hbHl0aWNzIHdoZW4gd2UgYXJlIGluIGxpbmVhciBkZXYgbW9kZVxyXG5cdFx0Ly8gaWYgKHRoaXMuY3VycmVudEJ1Y2tldCAhPSBudWxsKSB7XHJcblx0XHQvLyBcdHRoaXMuY3VycmVudEJ1Y2tldC5wYXNzZWQgPSBwYXNzZWQ7XHJcblx0XHQvLyBcdEFuYWx5dGljc0V2ZW50cy5zZW5kQnVja2V0KHRoaXMuY3VycmVudEJ1Y2tldCwgcGFzc2VkKTtcclxuXHRcdC8vIH1cclxuXHRcdGNvbnNvbGUubG9nKFwiTmV3IEJ1Y2tldDogXCIgKyBuZXdCdWNrZXQuYnVja2V0SUQpO1xyXG5cdFx0QXVkaW9Db250cm9sbGVyLlByZWxvYWRCdWNrZXQobmV3QnVja2V0LCB0aGlzLmFwcC5HZXREYXRhVVJMKCkpO1xyXG5cdFx0dGhpcy5pbml0QnVja2V0KG5ld0J1Y2tldCk7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgSGFzUXVlc3Rpb25zTGVmdCA9ICgpID0+IHtcclxuXHRcdC8vLy8gVE9ETzogY2hlY2sgYnVja2V0cywgY2hlY2sgaWYgZG9uZVxyXG5cdFx0dmFyIGhhc1F1ZXN0aW9uc0xlZnQgPSB0cnVlO1xyXG5cclxuXHRcdGlmICh0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0aWYgKHRoaXMuYnVja2V0R2VuTW9kZSA9PT0gQnVja2V0R2VuTW9kZS5MaW5lYXJBcnJheUJhc2VkKSB7XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCA+PSB0aGlzLmJ1Y2tldHMubGVuZ3RoICYmIHRoaXMuY3VycmVudExpbmVhclRhcmdldEluZGV4ID49IHRoaXMuYnVja2V0c1t0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleF0uaXRlbXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0Ly8gTm8gbW9yZSBxdWVzdGlvbnMgbGVmdFxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHRcclxuXHRcdGlmICh0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29ycmVjdCA+PSA0KSB7XHJcblx0XHRcdC8vcGFzc2VkIHRoaXMgYnVja2V0XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiUGFzc2VkIHRoaXMgYnVja2V0IFwiICsgdGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEKTtcclxuXHRcdFx0XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRCdWNrZXQuYnVja2V0SUQgPj0gdGhpcy5udW1CdWNrZXRzKSB7XHJcblx0XHRcdFx0Ly9wYXNzZWQgaGlnaGVzdCBidWNrZXRcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhcIlBhc3NlZCBoaWdoZXN0IGJ1Y2tldFwiKTtcclxuXHRcdFx0XHR0aGlzLmN1cnJlbnRCdWNrZXQucGFzc2VkID0gdHJ1ZTtcclxuXHRcdFx0XHRpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG5cdFx0XHRcdFx0QW5hbHl0aWNzRXZlbnRzLnNlbmRCdWNrZXQodGhpcy5jdXJyZW50QnVja2V0LCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0VUlDb250cm9sbGVyLlByb2dyZXNzQ2hlc3QoKTtcclxuXHRcdFx0XHRoYXNRdWVzdGlvbnNMZWZ0ID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Ly9tb3ZlZCB1cCB0byBuZXh0IGJ1Y2tldFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiTW92aW5nIHVwIGJ1Y2tldFwiKTtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50Tm9kZS5yaWdodCAhPSBudWxsKXtcclxuXHRcdFx0XHRcdC8vbW92ZSBkb3duIHRvIHJpZ2h0XHJcblx0XHRcdFx0XHRVSUNvbnRyb2xsZXIuUHJvZ3Jlc3NDaGVzdCgpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJNb3ZpbmcgdG8gcmlnaHQgbm9kZVwiKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLnJpZ2h0O1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jdXJyZW50TGluZWFyQnVja2V0SW5kZXgrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHRoaXMudHJ5TW92ZUJ1Y2tldCh0cnVlKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdC8vIFJlYWNoZWQgcm9vdCBub2RlXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlJlYWNoZWQgcm9vdCBub2RlXCIpO1xyXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5idWNrZXRHZW5Nb2RlID09PSBCdWNrZXRHZW5Nb2RlLlJhbmRvbUJTVCkge1xyXG5cdFx0XHRcdFx0XHRBbmFseXRpY3NFdmVudHMuc2VuZEJ1Y2tldCh0aGlzLmN1cnJlbnRCdWNrZXQsIHRydWUpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRVSUNvbnRyb2xsZXIuUHJvZ3Jlc3NDaGVzdCgpO1xyXG5cdFx0XHRcdFx0aGFzUXVlc3Rpb25zTGVmdCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmN1cnJlbnRCdWNrZXQubnVtQ29uc2VjdXRpdmVXcm9uZyA+PSAyIHx8IHRoaXMuY3VycmVudEJ1Y2tldC5udW1UcmllZCA+PSA1KSB7XHJcblx0XHRcdC8vIEZhaWxlZCB0aGlzIGJ1Y2tldFxyXG5cdFx0XHRjb25zb2xlLmxvZyhcIkZhaWxlZCB0aGlzIGJ1Y2tldCBcIiArIHRoaXMuY3VycmVudEJ1Y2tldC5idWNrZXRJRCk7XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRCdWNrZXQuYnVja2V0SUQgPCB0aGlzLmJhc2FsQnVja2V0KSB7XHJcblx0XHRcdFx0Ly8gVXBkYXRlIGJhc2FsIGJ1Y2tldCBudW1iZXJcclxuXHRcdFx0XHR0aGlzLmJhc2FsQnVja2V0ID0gdGhpcy5jdXJyZW50QnVja2V0LmJ1Y2tldElEO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0aGlzLmN1cnJlbnRCdWNrZXQuYnVja2V0SUQgPD0gMSkge1xyXG5cdFx0XHRcdC8vIEZhaWxlZCB0aGUgbG93ZXN0IGJ1Y2tldFxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiRmFpbGVkIGxvd2VzdCBidWNrZXQgIVwiKTtcclxuXHRcdFx0XHRoYXNRdWVzdGlvbnNMZWZ0ID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5jdXJyZW50QnVja2V0LnBhc3NlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcblx0XHRcdFx0XHRBbmFseXRpY3NFdmVudHMuc2VuZEJ1Y2tldCh0aGlzLmN1cnJlbnRCdWNrZXQsIGZhbHNlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJNb3ZpbmcgZG93biBidWNrZXQgIVwiKTtcclxuXHRcdFx0XHRpZiAodGhpcy5jdXJyZW50Tm9kZS5sZWZ0ICE9IG51bGwpe1xyXG5cdFx0XHRcdFx0Ly8gTW92ZSBkb3duIHRvIGxlZnRcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiTW92aW5nIHRvIGxlZnQgbm9kZVwiKTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLmxlZnQ7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmN1cnJlbnRMaW5lYXJCdWNrZXRJbmRleCsrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dGhpcy50cnlNb3ZlQnVja2V0KGZhbHNlKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gUmVhY2hlZCByb290IG5vZGVcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiUmVhY2hlZCByb290IG5vZGUgIVwiKTtcclxuXHRcdFx0XHRcdGhhc1F1ZXN0aW9uc0xlZnQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudEJ1Y2tldC5wYXNzZWQgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmJ1Y2tldEdlbk1vZGUgPT09IEJ1Y2tldEdlbk1vZGUuUmFuZG9tQlNUKSB7XHJcblx0XHRcdFx0XHRcdEFuYWx5dGljc0V2ZW50cy5zZW5kQnVja2V0KHRoaXMuY3VycmVudEJ1Y2tldCwgZmFsc2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBoYXNRdWVzdGlvbnNMZWZ0O1xyXG5cclxuXHR9XHJcblx0XHJcblx0cHVibGljIG92ZXJyaWRlIG9uRW5kKCk6IHZvaWQge1xyXG5cdFx0QW5hbHl0aWNzRXZlbnRzLnNlbmRGaW5pc2hlZCh0aGlzLmJ1Y2tldHMsIHRoaXMuYmFzYWxCdWNrZXQsIHRoaXMuY2VpbGluZ0J1Y2tldCk7XHJcblx0XHRVSUNvbnRyb2xsZXIuU2hvd0VuZCgpO1xyXG5cdFx0dGhpcy5hcHAudW5pdHlCcmlkZ2UuU2VuZENsb3NlKCk7XHJcblx0fVxyXG59XHJcbiIsIi8qKlxuICogTW9kdWxlIHRoYXQgd3JhcHMgVW5pdHkgY2FsbHMgZm9yIHNlbmRpbmcgbWVzc2FnZXMgZnJvbSB0aGUgd2VidmlldyB0byBVbml0eS5cbiAqL1xuXG5kZWNsYXJlIGNvbnN0IFVuaXR5O1xuXG5leHBvcnQgY2xhc3MgVW5pdHlCcmlkZ2Uge1xuXG5cdHByaXZhdGUgdW5pdHlSZWZlcmVuY2U7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0aWYgKHR5cGVvZiBVbml0eSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdHRoaXMudW5pdHlSZWZlcmVuY2UgPSBVbml0eTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy51bml0eVJlZmVyZW5jZSA9IG51bGw7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIFNlbmRNZXNzYWdlKG1lc3NhZ2U6IHN0cmluZykge1xuXHRcdGlmICh0aGlzLnVuaXR5UmVmZXJlbmNlICE9PSBudWxsKSB7XG5cdFx0XHR0aGlzLnVuaXR5UmVmZXJlbmNlLmNhbGwobWVzc2FnZSk7XG5cdFx0fVxuXHR9XG5cblx0cHVibGljIFNlbmRMb2FkZWQoKSB7XG5cdFx0aWYgKHRoaXMudW5pdHlSZWZlcmVuY2UgIT09IG51bGwpIHtcblx0XHRcdHRoaXMudW5pdHlSZWZlcmVuY2UuY2FsbChcImxvYWRlZFwiKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIndvdWxkIGNhbGwgVW5pdHkgbG9hZGVkIG5vd1wiKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgU2VuZENsb3NlKCkge1xuXHRcdGlmICh0aGlzLnVuaXR5UmVmZXJlbmNlICE9PSBudWxsKSB7XG5cdFx0XHR0aGlzLnVuaXR5UmVmZXJlbmNlLmNhbGwoXCJjbG9zZVwiKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIndvdWxkIGNsb3NlIFVuaXR5IG5vd1wiKTtcblx0XHR9XG5cdH1cblxufVxuIiwiaW1wb3J0IHsgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5leHBvcnQgKiBmcm9tICdAZmlyZWJhc2UvYXBwJztcblxudmFyIG5hbWUgPSBcImZpcmViYXNlXCI7XG52YXIgdmVyc2lvbiA9IFwiOS4xMi4xXCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbnJlZ2lzdGVyVmVyc2lvbihuYW1lLCB2ZXJzaW9uLCAnYXBwJyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20uanMubWFwXG4iLCJ0cnl7c2VsZltcIndvcmtib3g6d2luZG93OjcuMC4wXCJdJiZfKCl9Y2F0Y2gobil7fWZ1bmN0aW9uIG4obix0KXtyZXR1cm4gbmV3IFByb21pc2UoKGZ1bmN0aW9uKHIpe3ZhciBlPW5ldyBNZXNzYWdlQ2hhbm5lbDtlLnBvcnQxLm9ubWVzc2FnZT1mdW5jdGlvbihuKXtyKG4uZGF0YSl9LG4ucG9zdE1lc3NhZ2UodCxbZS5wb3J0Ml0pfSkpfWZ1bmN0aW9uIHQobix0KXtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl7dmFyIGU9dFtyXTtlLmVudW1lcmFibGU9ZS5lbnVtZXJhYmxlfHwhMSxlLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiBlJiYoZS53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sZS5rZXksZSl9fWZ1bmN0aW9uIHIobix0KXsobnVsbD09dHx8dD5uLmxlbmd0aCkmJih0PW4ubGVuZ3RoKTtmb3IodmFyIHI9MCxlPW5ldyBBcnJheSh0KTtyPHQ7cisrKWVbcl09bltyXTtyZXR1cm4gZX1mdW5jdGlvbiBlKG4sdCl7dmFyIGU7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIFN5bWJvbHx8bnVsbD09bltTeW1ib2wuaXRlcmF0b3JdKXtpZihBcnJheS5pc0FycmF5KG4pfHwoZT1mdW5jdGlvbihuLHQpe2lmKG4pe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBuKXJldHVybiByKG4sdCk7dmFyIGU9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG4pLnNsaWNlKDgsLTEpO3JldHVyblwiT2JqZWN0XCI9PT1lJiZuLmNvbnN0cnVjdG9yJiYoZT1uLmNvbnN0cnVjdG9yLm5hbWUpLFwiTWFwXCI9PT1lfHxcIlNldFwiPT09ZT9BcnJheS5mcm9tKG4pOlwiQXJndW1lbnRzXCI9PT1lfHwvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChlKT9yKG4sdCk6dm9pZCAwfX0obikpfHx0JiZuJiZcIm51bWJlclwiPT10eXBlb2Ygbi5sZW5ndGgpe2UmJihuPWUpO3ZhciBpPTA7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGk+PW4ubGVuZ3RoP3tkb25lOiEwfTp7ZG9uZTohMSx2YWx1ZTpuW2krK119fX10aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIil9cmV0dXJuKGU9bltTeW1ib2wuaXRlcmF0b3JdKCkpLm5leHQuYmluZChlKX10cnl7c2VsZltcIndvcmtib3g6Y29yZTo3LjAuMFwiXSYmXygpfWNhdGNoKG4pe312YXIgaT1mdW5jdGlvbigpe3ZhciBuPXRoaXM7dGhpcy5wcm9taXNlPW5ldyBQcm9taXNlKChmdW5jdGlvbih0LHIpe24ucmVzb2x2ZT10LG4ucmVqZWN0PXJ9KSl9O2Z1bmN0aW9uIG8obix0KXt2YXIgcj1sb2NhdGlvbi5ocmVmO3JldHVybiBuZXcgVVJMKG4scikuaHJlZj09PW5ldyBVUkwodCxyKS5ocmVmfXZhciB1PWZ1bmN0aW9uKG4sdCl7dGhpcy50eXBlPW4sT2JqZWN0LmFzc2lnbih0aGlzLHQpfTtmdW5jdGlvbiBhKG4sdCxyKXtyZXR1cm4gcj90P3Qobik6bjoobiYmbi50aGVufHwobj1Qcm9taXNlLnJlc29sdmUobikpLHQ/bi50aGVuKHQpOm4pfWZ1bmN0aW9uIGMoKXt9dmFyIGY9e3R5cGU6XCJTS0lQX1dBSVRJTkdcIn07ZnVuY3Rpb24gcyhuLHQpe2lmKCF0KXJldHVybiBuJiZuLnRoZW4/bi50aGVuKGMpOlByb21pc2UucmVzb2x2ZSgpfXZhciB2PWZ1bmN0aW9uKHIpe3ZhciBlLGM7ZnVuY3Rpb24gdihuLHQpe3ZhciBlLGM7cmV0dXJuIHZvaWQgMD09PXQmJih0PXt9KSwoZT1yLmNhbGwodGhpcyl8fHRoaXMpLm5uPXt9LGUudG49MCxlLnJuPW5ldyBpLGUuZW49bmV3IGksZS5vbj1uZXcgaSxlLnVuPTAsZS5hbj1uZXcgU2V0LGUuY249ZnVuY3Rpb24oKXt2YXIgbj1lLmZuLHQ9bi5pbnN0YWxsaW5nO2UudG4+MHx8IW8odC5zY3JpcHRVUkwsZS5zbi50b1N0cmluZygpKXx8cGVyZm9ybWFuY2Uubm93KCk+ZS51bis2ZTQ/KGUudm49dCxuLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ1cGRhdGVmb3VuZFwiLGUuY24pKTooZS5obj10LGUuYW4uYWRkKHQpLGUucm4ucmVzb2x2ZSh0KSksKytlLnRuLHQuYWRkRXZlbnRMaXN0ZW5lcihcInN0YXRlY2hhbmdlXCIsZS5sbil9LGUubG49ZnVuY3Rpb24obil7dmFyIHQ9ZS5mbixyPW4udGFyZ2V0LGk9ci5zdGF0ZSxvPXI9PT1lLnZuLGE9e3N3OnIsaXNFeHRlcm5hbDpvLG9yaWdpbmFsRXZlbnQ6bn07IW8mJmUubW4mJihhLmlzVXBkYXRlPSEwKSxlLmRpc3BhdGNoRXZlbnQobmV3IHUoaSxhKSksXCJpbnN0YWxsZWRcIj09PWk/ZS53bj1zZWxmLnNldFRpbWVvdXQoKGZ1bmN0aW9uKCl7XCJpbnN0YWxsZWRcIj09PWkmJnQud2FpdGluZz09PXImJmUuZGlzcGF0Y2hFdmVudChuZXcgdShcIndhaXRpbmdcIixhKSl9KSwyMDApOlwiYWN0aXZhdGluZ1wiPT09aSYmKGNsZWFyVGltZW91dChlLnduKSxvfHxlLmVuLnJlc29sdmUocikpfSxlLmRuPWZ1bmN0aW9uKG4pe3ZhciB0PWUuaG4scj10IT09bmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlcjtlLmRpc3BhdGNoRXZlbnQobmV3IHUoXCJjb250cm9sbGluZ1wiLHtpc0V4dGVybmFsOnIsb3JpZ2luYWxFdmVudDpuLHN3OnQsaXNVcGRhdGU6ZS5tbn0pKSxyfHxlLm9uLnJlc29sdmUodCl9LGUuZ249KGM9ZnVuY3Rpb24obil7dmFyIHQ9bi5kYXRhLHI9bi5wb3J0cyxpPW4uc291cmNlO3JldHVybiBhKGUuZ2V0U1coKSwoZnVuY3Rpb24oKXtlLmFuLmhhcyhpKSYmZS5kaXNwYXRjaEV2ZW50KG5ldyB1KFwibWVzc2FnZVwiLHtkYXRhOnQsb3JpZ2luYWxFdmVudDpuLHBvcnRzOnIsc3c6aX0pKX0pKX0sZnVuY3Rpb24oKXtmb3IodmFyIG49W10sdD0wO3Q8YXJndW1lbnRzLmxlbmd0aDt0Kyspblt0XT1hcmd1bWVudHNbdF07dHJ5e3JldHVybiBQcm9taXNlLnJlc29sdmUoYy5hcHBseSh0aGlzLG4pKX1jYXRjaChuKXtyZXR1cm4gUHJvbWlzZS5yZWplY3Qobil9fSksZS5zbj1uLGUubm49dCxuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLGUuZ24pLGV9Yz1yLChlPXYpLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGMucHJvdG90eXBlKSxlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcj1lLGUuX19wcm90b19fPWM7dmFyIGgsbCxtLHc9di5wcm90b3R5cGU7cmV0dXJuIHcucmVnaXN0ZXI9ZnVuY3Rpb24obil7dmFyIHQ9KHZvaWQgMD09PW4/e306bikuaW1tZWRpYXRlLHI9dm9pZCAwIT09dCYmdDt0cnl7dmFyIGU9dGhpcztyZXR1cm4gZnVuY3Rpb24obix0KXt2YXIgcj1uKCk7aWYociYmci50aGVuKXJldHVybiByLnRoZW4odCk7cmV0dXJuIHQocil9KChmdW5jdGlvbigpe2lmKCFyJiZcImNvbXBsZXRlXCIhPT1kb2N1bWVudC5yZWFkeVN0YXRlKXJldHVybiBzKG5ldyBQcm9taXNlKChmdW5jdGlvbihuKXtyZXR1cm4gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsbil9KSkpfSksKGZ1bmN0aW9uKCl7cmV0dXJuIGUubW49Qm9vbGVhbihuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyKSxlLnluPWUucG4oKSxhKGUuYm4oKSwoZnVuY3Rpb24obil7ZS5mbj1uLGUueW4mJihlLmhuPWUueW4sZS5lbi5yZXNvbHZlKGUueW4pLGUub24ucmVzb2x2ZShlLnluKSxlLnluLmFkZEV2ZW50TGlzdGVuZXIoXCJzdGF0ZWNoYW5nZVwiLGUubG4se29uY2U6ITB9KSk7dmFyIHQ9ZS5mbi53YWl0aW5nO3JldHVybiB0JiZvKHQuc2NyaXB0VVJMLGUuc24udG9TdHJpbmcoKSkmJihlLmhuPXQsUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoZnVuY3Rpb24oKXtlLmRpc3BhdGNoRXZlbnQobmV3IHUoXCJ3YWl0aW5nXCIse3N3OnQsd2FzV2FpdGluZ0JlZm9yZVJlZ2lzdGVyOiEwfSkpfSkpLnRoZW4oKGZ1bmN0aW9uKCl7fSkpKSxlLmhuJiYoZS5ybi5yZXNvbHZlKGUuaG4pLGUuYW4uYWRkKGUuaG4pKSxlLmZuLmFkZEV2ZW50TGlzdGVuZXIoXCJ1cGRhdGVmb3VuZFwiLGUuY24pLG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJjb250cm9sbGVyY2hhbmdlXCIsZS5kbiksZS5mbn0pKX0pKX1jYXRjaChuKXtyZXR1cm4gUHJvbWlzZS5yZWplY3Qobil9fSx3LnVwZGF0ZT1mdW5jdGlvbigpe3RyeXtyZXR1cm4gdGhpcy5mbj9zKHRoaXMuZm4udXBkYXRlKCkpOnZvaWQgMH1jYXRjaChuKXtyZXR1cm4gUHJvbWlzZS5yZWplY3Qobil9fSx3LmdldFNXPWZ1bmN0aW9uKCl7cmV0dXJuIHZvaWQgMCE9PXRoaXMuaG4/UHJvbWlzZS5yZXNvbHZlKHRoaXMuaG4pOnRoaXMucm4ucHJvbWlzZX0sdy5tZXNzYWdlU1c9ZnVuY3Rpb24odCl7dHJ5e3JldHVybiBhKHRoaXMuZ2V0U1coKSwoZnVuY3Rpb24ocil7cmV0dXJuIG4ocix0KX0pKX1jYXRjaChuKXtyZXR1cm4gUHJvbWlzZS5yZWplY3Qobil9fSx3Lm1lc3NhZ2VTa2lwV2FpdGluZz1mdW5jdGlvbigpe3RoaXMuZm4mJnRoaXMuZm4ud2FpdGluZyYmbih0aGlzLmZuLndhaXRpbmcsZil9LHcucG49ZnVuY3Rpb24oKXt2YXIgbj1uYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyO3JldHVybiBuJiZvKG4uc2NyaXB0VVJMLHRoaXMuc24udG9TdHJpbmcoKSk/bjp2b2lkIDB9LHcuYm49ZnVuY3Rpb24oKXt0cnl7dmFyIG49dGhpcztyZXR1cm4gZnVuY3Rpb24obix0KXt0cnl7dmFyIHI9bigpfWNhdGNoKG4pe3JldHVybiB0KG4pfWlmKHImJnIudGhlbilyZXR1cm4gci50aGVuKHZvaWQgMCx0KTtyZXR1cm4gcn0oKGZ1bmN0aW9uKCl7cmV0dXJuIGEobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIobi5zbixuLm5uKSwoZnVuY3Rpb24odCl7cmV0dXJuIG4udW49cGVyZm9ybWFuY2Uubm93KCksdH0pKX0pLChmdW5jdGlvbihuKXt0aHJvdyBufSkpfWNhdGNoKG4pe3JldHVybiBQcm9taXNlLnJlamVjdChuKX19LGg9diwobD1be2tleTpcImFjdGl2ZVwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmVuLnByb21pc2V9fSx7a2V5OlwiY29udHJvbGxpbmdcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5vbi5wcm9taXNlfX1dKSYmdChoLnByb3RvdHlwZSxsKSxtJiZ0KGgsbSksdn0oZnVuY3Rpb24oKXtmdW5jdGlvbiBuKCl7dGhpcy5Qbj1uZXcgTWFwfXZhciB0PW4ucHJvdG90eXBlO3JldHVybiB0LmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24obix0KXt0aGlzLlNuKG4pLmFkZCh0KX0sdC5yZW1vdmVFdmVudExpc3RlbmVyPWZ1bmN0aW9uKG4sdCl7dGhpcy5TbihuKS5kZWxldGUodCl9LHQuZGlzcGF0Y2hFdmVudD1mdW5jdGlvbihuKXtuLnRhcmdldD10aGlzO2Zvcih2YXIgdCxyPWUodGhpcy5TbihuLnR5cGUpKTshKHQ9cigpKS5kb25lOyl7KDAsdC52YWx1ZSkobil9fSx0LlNuPWZ1bmN0aW9uKG4pe3JldHVybiB0aGlzLlBuLmhhcyhuKXx8dGhpcy5Qbi5zZXQobixuZXcgU2V0KSx0aGlzLlBuLmdldChuKX0sbn0oKSk7ZXhwb3J0e3YgYXMgV29ya2JveCx1IGFzIFdvcmtib3hFdmVudCxuIGFzIG1lc3NhZ2VTV307XG4vLyMgc291cmNlTWFwcGluZ1VSTD13b3JrYm94LXdpbmRvdy5wcm9kLmVzNS5tanMubWFwXG4iLCIvKipcclxuICogQXBwIGNsYXNzIHRoYXQgcmVwcmVzZW50cyBhbiBlbnRyeSBwb2ludCBvZiB0aGUgYXBwbGljYXRpb24uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZ2V0VVVJRCwgZ2V0VXNlclNvdXJjZSwgZ2V0RGF0YUZpbGUgfSBmcm9tICcuL2NvbXBvbmVudHMvdXJsVXRpbHMnO1xyXG5pbXBvcnQgeyBTdXJ2ZXkgfSBmcm9tICcuL3N1cnZleS9zdXJ2ZXknO1xyXG5pbXBvcnQgeyBBc3Nlc3NtZW50IH0gZnJvbSAnLi9hc3Nlc3NtZW50L2Fzc2Vzc21lbnQnO1xyXG5pbXBvcnQgeyBVbml0eUJyaWRnZSB9IGZyb20gJy4vY29tcG9uZW50cy91bml0eUJyaWRnZSc7XHJcbmltcG9ydCB7IEFuYWx5dGljc0V2ZW50cyB9IGZyb20gJy4vY29tcG9uZW50cy9hbmFseXRpY3NFdmVudHMnO1xyXG5pbXBvcnQgeyBCYXNlUXVpeiB9IGZyb20gJy4vQmFzZVF1aXonO1xyXG5pbXBvcnQgeyBmZXRjaEFwcERhdGEsIGdldERhdGFVUkwgfSBmcm9tICcuL2NvbXBvbmVudHMvanNvblV0aWxzJztcclxuaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gJ2ZpcmViYXNlL2FwcCc7XHJcbmltcG9ydCB7IGdldEFuYWx5dGljcywgbG9nRXZlbnQgfSBmcm9tICdmaXJlYmFzZS9hbmFseXRpY3MnO1xyXG5pbXBvcnQgeyBXb3JrYm94IH0gZnJvbSAnd29ya2JveC13aW5kb3cnO1xyXG5pbXBvcnQgQ2FjaGVNb2RlbCBmcm9tICcuL2NvbXBvbmVudHMvY2FjaGVNb2RlbCc7XHJcbmltcG9ydCB7IFVJQ29udHJvbGxlciB9IGZyb20gJy4vY29tcG9uZW50cy91aUNvbnRyb2xsZXInO1xyXG5cclxuY29uc3QgYXBwVmVyc2lvbjogc3RyaW5nID0gXCJ2MS4wLjdcIjtcclxuXHJcbmxldCBsb2FkaW5nU2NyZWVuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nU2NyZWVuXCIpO1xyXG5cclxuY29uc3QgYnJvYWRjYXN0Q2hhbm5lbDogQnJvYWRjYXN0Q2hhbm5lbCA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKCdhcy1tZXNzYWdlLWNoYW5uZWwnKTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG5cclxuXHQvKiogQ291bGQgYmUgJ2Fzc2Vzc21lbnQnIG9yICdzdXJ2ZXknIGJhc2VkIG9uIHRoZSBkYXRhIGZpbGUgKi9cclxuXHRwdWJsaWMgZGF0YVVSTDogc3RyaW5nO1xyXG5cclxuXHRwdWJsaWMgdW5pdHlCcmlkZ2U7XHJcblx0cHVibGljIGFuYWx5dGljcztcclxuXHRwdWJsaWMgZ2FtZTogQmFzZVF1aXo7XHJcblxyXG5cdGNhY2hlTW9kZWw6IENhY2hlTW9kZWw7XHJcblxyXG5cdGxhbmc6IHN0cmluZyA9IFwiZW5nbGlzaFwiO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMudW5pdHlCcmlkZ2UgPSBuZXcgVW5pdHlCcmlkZ2UoKTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcIkluaXRpYWxpemluZyBhcHAuLi5cIik7XHJcblxyXG5cdFx0dGhpcy5kYXRhVVJMID0gZ2V0RGF0YUZpbGUoKTtcclxuXHJcblx0XHR0aGlzLmNhY2hlTW9kZWwgPSBuZXcgQ2FjaGVNb2RlbCh0aGlzLmRhdGFVUkwsIHRoaXMuZGF0YVVSTCwgbmV3IFNldDxzdHJpbmc+KCkpO1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKFwiRGF0YSBmaWxlOiBcIiArIHRoaXMuZGF0YVVSTCk7XHJcblxyXG5cdFx0Y29uc3QgZmlyZWJhc2VDb25maWcgPSB7XHJcblx0XHQgIGFwaUtleTogXCJBSXphU3lCOGMybEJWaTI2dTdZUkw5c3hPUDk3VWFxM3lOOGhUbDRcIixcclxuXHRcdCAgYXV0aERvbWFpbjogXCJmdG0tYjlkOTkuZmlyZWJhc2VhcHAuY29tXCIsXHJcblx0XHQgIGRhdGFiYXNlVVJMOiBcImh0dHBzOi8vZnRtLWI5ZDk5LmZpcmViYXNlaW8uY29tXCIsXHJcblx0XHQgIHByb2plY3RJZDogXCJmdG0tYjlkOTlcIixcclxuXHRcdCAgc3RvcmFnZUJ1Y2tldDogXCJmdG0tYjlkOTkuYXBwc3BvdC5jb21cIixcclxuXHRcdCAgbWVzc2FnaW5nU2VuZGVySWQ6IFwiNjAyNDAyMzg3OTQxXCIsXHJcblx0XHQgIGFwcElkOiBcIjE6NjAyNDAyMzg3OTQxOndlYjo3YjFiMTE4MTg2NGQyOGI0OWRlMTBjXCIsXHJcblx0XHQgIG1lYXN1cmVtZW50SWQ6IFwiRy1GRjExNTlUR0NGXCJcclxuXHRcdH07XHJcblxyXG5cdFx0Y29uc3QgZmFwcCA9IGluaXRpYWxpemVBcHAoZmlyZWJhc2VDb25maWcpO1xyXG5cdFx0Y29uc3QgZmFuYWx5dGljcyA9IGdldEFuYWx5dGljcyhmYXBwKTtcclxuXHJcblx0XHR0aGlzLmFuYWx5dGljcyA9IGZhbmFseXRpY3M7XHJcblx0XHRsb2dFdmVudChmYW5hbHl0aWNzLCAnbm90aWZpY2F0aW9uX3JlY2VpdmVkJyk7XHJcblx0XHRsb2dFdmVudChmYW5hbHl0aWNzLFwidGVzdCBpbml0aWFsaXphdGlvbiBldmVudFwiLHt9KTtcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcImZpcmViYXNlIGluaXRpYWxpemVkXCIpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGFzeW5jIHNwaW5VcCgpIHtcclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIldpbmRvdyBMb2FkZWQhXCIpO1xyXG5cdFx0XHQoYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdGF3YWl0IGZldGNoQXBwRGF0YSh0aGlzLmRhdGFVUkwpLnRoZW4oZGF0YSA9PiB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkFzc2Vzc21lbnQvU3VydmV5IFwiICsgYXBwVmVyc2lvbiArIFwiIGluaXRpYWxpemluZyFcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkFwcCBkYXRhIGxvYWRlZCFcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcblx0XHRcdFx0XHR0aGlzLmNhY2hlTW9kZWwuc2V0Q29udGVudEZpbGVQYXRoKGdldERhdGFVUkwodGhpcy5kYXRhVVJMKSk7XHJcblxyXG5cdFx0XHRcdFx0Ly8gVE9ETzogV2h5IGRvIHdlIG5lZWQgdG8gc2V0IHRoZSBmZWVkYmFjayB0ZXh0IGhlcmU/XHJcblx0XHRcdFx0XHRVSUNvbnRyb2xsZXIuU2V0RmVlZGJhY2tUZXh0KGRhdGFbXCJmZWVkYmFja1RleHRcIl0pO1xyXG5cclxuXHRcdFx0XHRcdGxldCBhcHBUeXBlID0gZGF0YVtcImFwcFR5cGVcIl07XHJcblx0XHRcdFx0XHRsZXQgYXNzZXNzbWVudFR5cGUgPSBkYXRhW1wiYXNzZXNzbWVudFR5cGVcIl07XHJcblxyXG5cdFx0XHRcdFx0aWYgKGFwcFR5cGUgPT0gXCJzdXJ2ZXlcIikge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmdhbWUgPSBuZXcgU3VydmV5KHRoaXMuZGF0YVVSTCwgdGhpcy51bml0eUJyaWRnZSk7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGFwcFR5cGUgPT0gXCJhc3Nlc3NtZW50XCIpIHtcclxuXHRcdFx0XHRcdFx0Ly8gR2V0IGFuZCBhZGQgYWxsIHRoZSBhdWRpbyBhc3NldHMgdG8gdGhlIGNhY2hlIG1vZGVsXHJcblxyXG5cdFx0XHRcdFx0XHRsZXQgYnVja2V0cyA9IGRhdGFbXCJidWNrZXRzXCJdO1xyXG5cclxuXHRcdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBidWNrZXRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdFx0Zm9yIChsZXQgaiA9IDA7IGogPCBidWNrZXRzW2ldLml0ZW1zLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRsZXQgYXVkaW9JdGVtVVJMO1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVXNlIHRvIGxvd2VyIGNhc2UgZm9yIHRoZSBMdWdhbmRhbiBkYXRhXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YVtcInF1aXpOYW1lXCJdLmluY2x1ZGVzKFwiTHVnYW5kYVwiKSB8fCBkYXRhW1wicXVpek5hbWVcIl0udG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhcIndlc3QgYWZyaWNhbiBlbmdsaXNoXCIpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGF1ZGlvSXRlbVVSTCA9IFwiL2F1ZGlvL1wiICsgdGhpcy5kYXRhVVJMICsgXCIvXCIgKyBidWNrZXRzW2ldLml0ZW1zW2pdLml0ZW1OYW1lLnRvTG93ZXJDYXNlKCkudHJpbSgpICsgXCIubXAzXCI7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRhdWRpb0l0ZW1VUkwgPSBcIi9hdWRpby9cIiArIHRoaXMuZGF0YVVSTCArIFwiL1wiICsgYnVja2V0c1tpXS5pdGVtc1tqXS5pdGVtTmFtZS50cmltKCkgKyBcIi5tcDNcIjtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmNhY2hlTW9kZWwuYWRkSXRlbVRvQXVkaW9WaXN1YWxSZXNvdXJjZXMoYXVkaW9JdGVtVVJMKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHRoaXMuY2FjaGVNb2RlbC5hZGRJdGVtVG9BdWRpb1Zpc3VhbFJlc291cmNlcyhcIi9hdWRpby9cIiArIHRoaXMuZGF0YVVSTCArIFwiL2Fuc3dlcl9mZWVkYmFjay5tcDNcIik7XHJcblxyXG5cdFx0XHRcdFx0XHR0aGlzLmdhbWUgPSBuZXcgQXNzZXNzbWVudCh0aGlzLmRhdGFVUkwsIHRoaXMudW5pdHlCcmlkZ2UpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS51bml0eUJyaWRnZSA9IHRoaXMudW5pdHlCcmlkZ2U7XHJcblxyXG5cdFx0XHRcdFx0QW5hbHl0aWNzRXZlbnRzLnNldFV1aWQoZ2V0VVVJRCgpLCBnZXRVc2VyU291cmNlKCkpO1xyXG5cdFx0XHRcdFx0QW5hbHl0aWNzRXZlbnRzLmxpbmtBbmFseXRpY3ModGhpcy5hbmFseXRpY3MsIHRoaXMuZGF0YVVSTCk7XHJcblx0XHRcdFx0XHRBbmFseXRpY3NFdmVudHMuc2V0QXNzZXNzbWVudFR5cGUoYXNzZXNzbWVudFR5cGUpOyBcclxuXHRcdFx0XHRcdEFuYWx5dGljc0V2ZW50cy5zZW5kSW5pdChhcHBWZXJzaW9uLCBkYXRhW1wiY29udGVudFZlcnNpb25cIl0pO1xyXG5cdFx0XHRcdFx0Ly8gdGhpcy5jYWNoZU1vZGVsLnNldEFwcE5hbWUodGhpcy5jYWNoZU1vZGVsLmFwcE5hbWUgKyAnOicgKyBkYXRhW1wiY29udGVudFZlcnNpb25cIl0pO1xyXG5cclxuXHRcdFx0XHRcdHRoaXMuZ2FtZS5SdW4odGhpcyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0YXdhaXQgdGhpcy5yZWdpc3RlclNlcnZpY2VXb3JrZXIodGhpcy5nYW1lKTtcclxuXHRcdFx0fSkoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgcmVnaXN0ZXJTZXJ2aWNlV29ya2VyKGdhbWU6IEJhc2VRdWl6KSB7XHJcblx0XHRjb25zb2xlLmxvZyhcIlJlZ2lzdGVyaW5nIHNlcnZpY2Ugd29ya2VyLi4uXCIpO1xyXG5cclxuXHRcdGlmIChcInNlcnZpY2VXb3JrZXJcIiBpbiBuYXZpZ2F0b3IpIHtcclxuXHRcdFx0bGV0IHdiID0gbmV3IFdvcmtib3goJy4vc3cuanMnLCB7fSk7XHJcblxyXG5cdFx0XHR3Yi5yZWdpc3RlcigpLnRoZW4oKHJlZ2lzdHJhdGlvbikgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiU2VydmljZSB3b3JrZXIgcmVnaXN0ZXJlZCFcIik7XHJcblx0XHRcdFx0dGhpcy5oYW5kbGVTZXJ2aWNlV29ya2VyUmVnaXN0YXRpb24ocmVnaXN0cmF0aW9uKTtcclxuXHRcdFx0fSkuY2F0Y2goKGVycikgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogXCIgKyBlcnIpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGhhbmRsZVNlcnZpY2VXb3JrZXJNZXNzYWdlKTtcclxuXHJcblx0XHRcdGF3YWl0IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlYWR5O1xyXG5cdFx0XHRcclxuXHRcdFx0Y29uc29sZS5sb2coXCJDYWNoZSBNb2RlbDogXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGlzLmNhY2hlTW9kZWwpO1xyXG5cclxuXHRcdFx0aWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMuY2FjaGVNb2RlbC5hcHBOYW1lKSA9PSBudWxsKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJXRSBET05UIEhBVkUgVEhJUyBBU1NFU1NNRU5UPCBDQUNISU5HIElUIVwiKTtcclxuXHRcdFx0XHRsb2FkaW5nU2NyZWVuIS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XHJcbiAgICAgICAgICAgICAgICBicm9hZGNhc3RDaGFubmVsLnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBcIkNhY2hlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBEYXRhOiB0aGlzLmNhY2hlTW9kZWwsXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblx0XHRcdFx0bG9hZGluZ1NjcmVlbiEuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRicm9hZGNhc3RDaGFubmVsLm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuY29tbWFuZCArIFwiIHJlY2VpdmVkIGZyb20gc2VydmljZSB3b3JrZXIhXCIpO1xyXG5cdFx0XHRcdGlmIChldmVudC5kYXRhLmNvbW1hbmQgPT0gXCJBY3RpdmF0ZWRcIiAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmNhY2hlTW9kZWwuYXBwTmFtZSkgPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0YnJvYWRjYXN0Q2hhbm5lbC5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdFx0XHRcdGNvbW1hbmQ6IFwiQ2FjaGVcIixcclxuXHRcdFx0XHRcdFx0ZGF0YToge1xyXG5cdFx0XHRcdFx0XHRcdGFwcERhdGE6IHRoaXMuY2FjaGVNb2RlbCxcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihcIlNlcnZpY2Ugd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXIuXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aGFuZGxlU2VydmljZVdvcmtlclJlZ2lzdGF0aW9uKHJlZ2lzdHJhdGlvbjogU2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbiB8IHVuZGVmaW5lZCk6IHZvaWQge1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmVnaXN0cmF0aW9uPy5pbnN0YWxsaW5nPy5wb3N0TWVzc2FnZSh7XHJcblx0XHRcdFx0dHlwZTogJ1JlZ2lzdGFydGlvbicsXHJcblx0XHRcdFx0dmFsdWU6IHRoaXMubGFuZ1xyXG5cdFx0XHR9KVxyXG5cdFx0fSBjYXRjaCAoZXJyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZDogXCIgKyBlcnIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIEdldERhdGFVUkwoKTogc3RyaW5nIHtcclxuXHRcdHJldHVybiB0aGlzLmRhdGFVUkw7XHJcblx0fVxyXG59XHJcblxyXG5icm9hZGNhc3RDaGFubmVsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGhhbmRsZVNlcnZpY2VXb3JrZXJNZXNzYWdlKTtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVNlcnZpY2VXb3JrZXJNZXNzYWdlKGV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoZXZlbnQuZGF0YS5tc2cgPT0gXCJMb2FkaW5nXCIpIHtcclxuICAgICAgICBsZXQgcHJvZ3Jlc3NWYWx1ZSA9IHBhcnNlSW50KGV2ZW50LmRhdGEuZGF0YS5wcm9ncmVzcyk7XHJcbiAgICAgICAgaGFuZGxlTG9hZGluZ01lc3NhZ2UoZXZlbnQsIHByb2dyZXNzVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGV2ZW50LmRhdGEubXNnID09IFwiVXBkYXRlRm91bmRcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiPj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4uLHVwZGF0ZSBGb3VuZFwiKTtcclxuICAgICAgICBoYW5kbGVVcGRhdGVGb3VuZE1lc3NhZ2UoKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlTG9hZGluZ01lc3NhZ2UoZXZlbnQsIHByb2dyZXNzVmFsdWUpOiB2b2lkIHtcclxuICAgIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3NCYXJcIik7XHJcbiAgICBpZiAocHJvZ3Jlc3NWYWx1ZSA8IDEwMCYmcHJvZ3Jlc3NWYWx1ZT49MTApIHtcclxuICAgICAgICBwcm9ncmVzc0JhciEuc3R5bGUud2lkdGggPSBwcm9ncmVzc1ZhbHVlICsgXCIlXCI7XHJcbiAgICB9IGVsc2UgaWYgKHByb2dyZXNzVmFsdWUgPj0gMTAwKSB7XHJcbiAgICAgICAgbG9hZGluZ1NjcmVlbiEuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cdFx0VUlDb250cm9sbGVyLlNldENvbnRlbnRMb2FkZWQodHJ1ZSk7XHJcbiAgICAgICAgLy8gYWRkIGJvb2sgd2l0aCBhIG5hbWUgdG8gbG9jYWwgc3RvcmFnZSBhcyBjYWNoZWRcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShldmVudC5kYXRhLmRhdGEuYm9va05hbWUsIFwidHJ1ZVwiKTtcclxuICAgICAgICByZWFkTGFuZ3VhZ2VEYXRhRnJvbUNhY2hlQW5kTm90aWZ5QW5kcm9pZEFwcChldmVudC5kYXRhLmRhdGEuYm9va05hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkTGFuZ3VhZ2VEYXRhRnJvbUNhY2hlQW5kTm90aWZ5QW5kcm9pZEFwcChib29rTmFtZTogc3RyaW5nKSB7XHJcbiAgICAvL0B0cy1pZ25vcmVcclxuICAgIGlmICh3aW5kb3cuQW5kcm9pZCkge1xyXG4gICAgICAgIGxldCBpc0NvbnRlbnRDYWNoZWQ6IGJvb2xlYW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShib29rTmFtZSkgIT09IG51bGw7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgd2luZG93LkFuZHJvaWQuY2FjaGVkU3RhdHVzKGlzQ29udGVudENhY2hlZCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZVVwZGF0ZUZvdW5kTWVzc2FnZSgpOiB2b2lkIHtcclxuICAgIGxldCB0ZXh0ID0gXCJVcGRhdGUgRm91bmQuXFxuUGxlYXNlIGFjY2VwdCB0aGUgdXBkYXRlIGJ5IHByZXNzaW5nIE9rLlwiO1xyXG4gICAgaWYgKGNvbmZpcm0odGV4dCkgPT0gdHJ1ZSkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGV4dCA9IFwiVXBkYXRlIHdpbGwgaGFwcGVuIG9uIHRoZSBuZXh0IGxhdW5jaC5cIjtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xyXG5hcHAuc3BpblVwKCk7XHJcbiIsIi8vIEludGVyZmFjZSB0aGF0IGdldHMgcGFzc2VkIGFyb3VuZCB0aGUgYXBwIGNvbXBvbmVudHMgdG8gZ2F0aGVyIGFsbCByZXF1cmllZCByZXNvdXJjZXNcbi8vIGFuZCB0aGF0IGdldHMgc2VudCB0byB0aGUgc2VydmljZSB3b3JrZXIgZm9yIGNhY2hpbmdcblxuaW50ZXJmYWNlIElDYWNoZU1vZGVsIHtcbiAgICBhcHBOYW1lOiBzdHJpbmc7XG4gICAgY29udGVudEZpbGVQYXRoOiBzdHJpbmc7XG4gICAgYXVkaW9WaXN1YWxSZXNvdXJjZXM6IFNldDxzdHJpbmc+O1xufVxuXG5jbGFzcyBDYWNoZU1vZGVsIGltcGxlbWVudHMgSUNhY2hlTW9kZWwge1xuICAgIGFwcE5hbWU6IHN0cmluZztcbiAgICBjb250ZW50RmlsZVBhdGg6IHN0cmluZztcbiAgICBhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz47XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBOYW1lOiBzdHJpbmcsIGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nLCBhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy5hcHBOYW1lID0gYXBwTmFtZTtcbiAgICAgICAgdGhpcy5jb250ZW50RmlsZVBhdGggPSBjb250ZW50RmlsZVBhdGg7XG4gICAgICAgIHRoaXMuYXVkaW9WaXN1YWxSZXNvdXJjZXMgPSBhdWRpb1Zpc3VhbFJlc291cmNlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0QXBwTmFtZShhcHBOYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5hcHBOYW1lID0gYXBwTmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0Q29udGVudEZpbGVQYXRoKGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY29udGVudEZpbGVQYXRoID0gY29udGVudEZpbGVQYXRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRBdWRpb1Zpc3VhbFJlc291cmNlcyhhdWRpb1Zpc3VhbFJlc291cmNlczogU2V0PHN0cmluZz4pIHtcbiAgICAgICAgdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcyA9IGF1ZGlvVmlzdWFsUmVzb3VyY2VzO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRJdGVtVG9BdWRpb1Zpc3VhbFJlc291cmNlcyhpdGVtOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCF0aGlzLmF1ZGlvVmlzdWFsUmVzb3VyY2VzLmhhcyhpdGVtKSkge1xuICAgICAgICAgICAgdGhpcy5hdWRpb1Zpc3VhbFJlc291cmNlcy5hZGQoaXRlbSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FjaGVNb2RlbDtcblxuIl0sIm5hbWVzIjpbIl9fd2VicGFja19yZXF1aXJlX18iLCJnZXREYXRhRmlsZSIsImRhdGEiLCJnZXRQYXRoTmFtZSIsImdldCIsInVuZGVmaW5lZCIsImNvbnNvbGUiLCJsb2ciLCJxdWVyeVN0cmluZyIsIndpbmRvdyIsImxvY2F0aW9uIiwic2VhcmNoIiwiVVJMU2VhcmNoUGFyYW1zIiwiZyIsImdsb2JhbFRoaXMiLCJ0aGlzIiwiRnVuY3Rpb24iLCJlIiwiZ2V0RGF0YVVSTCIsInVybCIsImxvYWREYXRhIiwiZnVybCIsImZldGNoIiwidGhlbiIsInJlc3BvbnNlIiwianNvbiIsIkF1ZGlvQ29udHJvbGxlciIsImltYWdlVG9DYWNoZSIsIndhdlRvQ2FjaGUiLCJhbGxBdWRpb3MiLCJhbGxJbWFnZXMiLCJkYXRhVVJMIiwiY29ycmVjdFNvdW5kUGF0aCIsImZlZWRiYWNrQXVkaW8iLCJjb3JyZWN0QXVkaW8iLCJpbml0IiwiQXVkaW8iLCJzcmMiLCJzdGF0aWMiLCJxdWVzdGlvbnNEYXRhIiwiZ2V0SW5zdGFuY2UiLCJmZWVkYmFja1NvdW5kUGF0aCIsInF1ZXN0aW9uSW5kZXgiLCJwdXNoIiwicXVlc3Rpb25EYXRhIiwiYW5zd2VySW5kZXgiLCJwcm9tcHRBdWRpbyIsIkZpbHRlckFuZEFkZEF1ZGlvVG9BbGxBdWRpb3MiLCJ0b0xvd2VyQ2FzZSIsInByb21wdEltZyIsIkFkZEltYWdlVG9BbGxJbWFnZXMiLCJhbnN3ZXJzIiwiYW5zd2VyRGF0YSIsImFuc3dlckltZyIsIm5ld0ltYWdlVVJMIiwibmV3SW1hZ2UiLCJJbWFnZSIsIm5ld0F1ZGlvVVJMIiwiaW5jbHVkZXMiLCJyZXBsYWNlIiwidHJpbSIsIm5ld0F1ZGlvIiwic3BsaXQiLCJuZXdCdWNrZXQiLCJpdGVtSW5kZXgiLCJpdGVtcyIsIml0ZW0iLCJpdGVtTmFtZSIsImF1ZGlvTmFtZSIsImZpbmlzaGVkQ2FsbGJhY2siLCJhdWRpb0FuaW0iLCJzbGljZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiYXVkaW8iLCJhZGRFdmVudExpc3RlbmVyIiwicGxheSIsImNhdGNoIiwiZXJyb3IiLCJ3YXJuIiwiaW1hZ2VOYW1lIiwiaW5zdGFuY2UiLCJyYW5kRnJvbSIsImFycmF5IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibGVuZ3RoIiwic2h1ZmZsZUFycmF5IiwiaSIsImoiLCJVSUNvbnRyb2xsZXIiLCJsYW5kaW5nQ29udGFpbmVySWQiLCJnYW1lQ29udGFpbmVySWQiLCJlbmRDb250YWluZXJJZCIsInN0YXJDb250YWluZXJJZCIsImNoZXN0Q29udGFpbmVySWQiLCJxdWVzdGlvbnNDb250YWluZXJJZCIsImZlZWRiYWNrQ29udGFpbmVySWQiLCJhbnN3ZXJzQ29udGFpbmVySWQiLCJhbnN3ZXJCdXR0b24xSWQiLCJhbnN3ZXJCdXR0b24ySWQiLCJhbnN3ZXJCdXR0b24zSWQiLCJhbnN3ZXJCdXR0b240SWQiLCJhbnN3ZXJCdXR0b241SWQiLCJhbnN3ZXJCdXR0b242SWQiLCJwbGF5QnV0dG9uSWQiLCJjaGVzdEltZ0lkIiwibmV4dFF1ZXN0aW9uIiwiY29udGVudExvYWRlZCIsInNob3duIiwic3RhcnMiLCJzaG93blN0YXJzQ291bnQiLCJzdGFyUG9zaXRpb25zIiwiQXJyYXkiLCJxQW5zTnVtIiwiYnV0dG9ucyIsImJ1dHRvbnNBY3RpdmUiLCJkZXZNb2RlQ29ycmVjdExhYmVsVmlzaWJpbGl0eSIsImxhbmRpbmdDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZ2FtZUNvbnRhaW5lciIsImVuZENvbnRhaW5lciIsInN0YXJDb250YWluZXIiLCJjaGVzdENvbnRhaW5lciIsInF1ZXN0aW9uc0NvbnRhaW5lciIsImZlZWRiYWNrQ29udGFpbmVyIiwiYW5zd2Vyc0NvbnRhaW5lciIsImFuc3dlckJ1dHRvbjEiLCJhbnN3ZXJCdXR0b24yIiwiYW5zd2VyQnV0dG9uMyIsImFuc3dlckJ1dHRvbjQiLCJhbnN3ZXJCdXR0b241IiwiYW5zd2VyQnV0dG9uNiIsInBsYXlCdXR0b24iLCJjaGVzdEltZyIsImluaXRpYWxpemVTdGFycyIsImluaXRFdmVudExpc3RlbmVycyIsIm5ld1N0YXIiLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsImlubmVySFRNTCIsIlNldENvcnJlY3RMYWJlbFZpc2liaWxpdHkiLCJ2aXNpYmxlIiwieCIsInkiLCJtaW5EaXN0YW5jZSIsImR4IiwiZHkiLCJzcXJ0IiwiYW5zd2VyQnV0dG9uUHJlc3MiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2hvd0dhbWUiLCJzaG93T3B0aW9ucyIsIm5ld1EiLCJhbmltYXRpb25EdXJhdGlvbiIsImRlbGF5QmZvcmVPcHRpb24iLCJvcHRpb25zRGlzcGxheWVkIiwiZm9yRWFjaCIsImJ1dHRvbiIsInN0eWxlIiwidmlzaWJpbGl0eSIsImFuaW1hdGlvbiIsInNldFRpbWVvdXQiLCJjdXJBbnN3ZXIiLCJpc0NvcnJlY3QiLCJhbnN3ZXJOYW1lIiwiY29ycmVjdCIsImFuc3dlclRleHQiLCJjb3JyZWN0TGFiZWwiLCJib3hTaGFkb3ciLCJ0bXBpbWciLCJHZXRJbWFnZSIsImVuYWJsZUFuc3dlckJ1dHRvbiIsInFTdGFydCIsIkRhdGUiLCJub3ciLCJudCIsInNob3dMYW5kaW5nIiwiZGlzcGxheSIsImFsbFN0YXJ0Iiwic3RhcnRQcmVzc0NhbGxiYWNrIiwicmVtb3ZlIiwiUGxheUNvcnJlY3QiLCJiIiwiU2hvd1F1ZXN0aW9uIiwiUGxheUF1ZGlvIiwiU2hvd0F1ZGlvQW5pbWF0aW9uIiwicGxheWluZyIsInF1ZXJ5U2VsZWN0b3IiLCJuZXdRdWVzdGlvbiIsInFDb2RlIiwiYnV0dG9uSW5kZXgiLCJwcm9tcHRUZXh0Iiwic3RhclRvU2hvdyIsInBvc2l0aW9uIiwiY29udGFpbmVyV2lkdGgiLCJvZmZzZXRXaWR0aCIsImNvbnRhaW5lckhlaWdodCIsIm9mZnNldEhlaWdodCIsInJhbmRvbVgiLCJyYW5kb21ZIiwiT3ZlcmxhcHBpbmdPdGhlclN0YXJzIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsInpJbmRleCIsInRvcCIsImlubmVySGVpZ2h0IiwibGVmdCIsInJvdGF0aW9uIiwiZmlsdGVyIiwiYnV0dG9uTnVtIiwiYWxsQnV0dG9uc1Zpc2libGUiLCJldmVyeSIsIlBsYXlEaW5nIiwiZFRpbWUiLCJidXR0b25QcmVzc0NhbGxiYWNrIiwiY2hlc3RJbWFnZSIsImN1cnJlbnRJbWdTcmMiLCJjdXJyZW50SW1hZ2VOdW1iZXIiLCJwYXJzZUludCIsIm5leHRJbWFnZVNyYyIsInZhbHVlIiwiY2FsbGJhY2siLCJzdHJpbmdUb0J5dGVBcnJheSQxIiwic3RyIiwib3V0IiwicCIsImMiLCJjaGFyQ29kZUF0IiwiYmFzZTY0IiwiYnl0ZVRvQ2hhck1hcF8iLCJjaGFyVG9CeXRlTWFwXyIsImJ5dGVUb0NoYXJNYXBXZWJTYWZlXyIsImNoYXJUb0J5dGVNYXBXZWJTYWZlXyIsIkVOQ09ERURfVkFMU19CQVNFIiwiRU5DT0RFRF9WQUxTIiwiRU5DT0RFRF9WQUxTX1dFQlNBRkUiLCJIQVNfTkFUSVZFX1NVUFBPUlQiLCJhdG9iIiwiZW5jb2RlQnl0ZUFycmF5IiwiaW5wdXQiLCJ3ZWJTYWZlIiwiaXNBcnJheSIsIkVycm9yIiwiaW5pdF8iLCJieXRlVG9DaGFyTWFwIiwib3V0cHV0IiwiYnl0ZTEiLCJoYXZlQnl0ZTIiLCJieXRlMiIsImhhdmVCeXRlMyIsImJ5dGUzIiwib3V0Qnl0ZTEiLCJvdXRCeXRlMiIsIm91dEJ5dGUzIiwib3V0Qnl0ZTQiLCJqb2luIiwiZW5jb2RlU3RyaW5nIiwiYnRvYSIsImRlY29kZVN0cmluZyIsImJ5dGVzIiwicG9zIiwiYzEiLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJjMiIsInUiLCJjMyIsImJ5dGVBcnJheVRvU3RyaW5nIiwiZGVjb2RlU3RyaW5nVG9CeXRlQXJyYXkiLCJjaGFyVG9CeXRlTWFwIiwiY2hhckF0IiwiYnl0ZTQiLCJiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyIsInV0ZjhCeXRlcyIsImJhc2U2NEVuY29kZSIsImluZGV4ZWREQiIsInByZUV4aXN0IiwiREJfQ0hFQ0tfTkFNRSIsInJlcXVlc3QiLCJzZWxmIiwib3BlbiIsIm9uc3VjY2VzcyIsInJlc3VsdCIsImNsb3NlIiwiZGVsZXRlRGF0YWJhc2UiLCJvbnVwZ3JhZGVuZWVkZWQiLCJvbmVycm9yIiwiX2EiLCJtZXNzYWdlIiwiZ2V0RGVmYXVsdHMiLCJnZXRHbG9iYWwiLCJfX0ZJUkVCQVNFX0RFRkFVTFRTX18iLCJwcm9jZXNzIiwiZW52IiwiZGVmYXVsdHNKc29uU3RyaW5nIiwiSlNPTiIsInBhcnNlIiwiZ2V0RGVmYXVsdHNGcm9tRW52VmFyaWFibGUiLCJtYXRjaCIsImNvb2tpZSIsImRlY29kZWQiLCJiYXNlNjREZWNvZGUiLCJnZXREZWZhdWx0c0Zyb21Db29raWUiLCJpbmZvIiwiRGVmZXJyZWQiLCJjb25zdHJ1Y3RvciIsInByb21pc2UiLCJ3cmFwQ2FsbGJhY2siLCJGaXJlYmFzZUVycm9yIiwiY29kZSIsImN1c3RvbURhdGEiLCJzdXBlciIsIm5hbWUiLCJPYmplY3QiLCJzZXRQcm90b3R5cGVPZiIsInByb3RvdHlwZSIsImNhcHR1cmVTdGFja1RyYWNlIiwiRXJyb3JGYWN0b3J5IiwiY3JlYXRlIiwic2VydmljZSIsInNlcnZpY2VOYW1lIiwiZXJyb3JzIiwiZnVsbENvZGUiLCJ0ZW1wbGF0ZSIsIlBBVFRFUk4iLCJfIiwia2V5IiwicmVwbGFjZVRlbXBsYXRlIiwiZnVsbE1lc3NhZ2UiLCJkZWVwRXF1YWwiLCJhIiwiYUtleXMiLCJrZXlzIiwiYktleXMiLCJrIiwiYVByb3AiLCJiUHJvcCIsImlzT2JqZWN0IiwidGhpbmciLCJjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzIiwiYmFja29mZkNvdW50IiwiaW50ZXJ2YWxNaWxsaXMiLCJiYWNrb2ZmRmFjdG9yIiwiY3VyckJhc2VWYWx1ZSIsInBvdyIsInJhbmRvbVdhaXQiLCJyb3VuZCIsIm1pbiIsIl9kZWxlZ2F0ZSIsIkNvbXBvbmVudCIsImluc3RhbmNlRmFjdG9yeSIsInR5cGUiLCJtdWx0aXBsZUluc3RhbmNlcyIsInNlcnZpY2VQcm9wcyIsImluc3RhbnRpYXRpb25Nb2RlIiwib25JbnN0YW5jZUNyZWF0ZWQiLCJzZXRJbnN0YW50aWF0aW9uTW9kZSIsIm1vZGUiLCJzZXRNdWx0aXBsZUluc3RhbmNlcyIsInNldFNlcnZpY2VQcm9wcyIsInByb3BzIiwic2V0SW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2siLCJERUZBVUxUX0VOVFJZX05BTUUiLCJQcm92aWRlciIsImNvbnRhaW5lciIsImNvbXBvbmVudCIsImluc3RhbmNlcyIsIk1hcCIsImluc3RhbmNlc0RlZmVycmVkIiwiaW5zdGFuY2VzT3B0aW9ucyIsIm9uSW5pdENhbGxiYWNrcyIsImlkZW50aWZpZXIiLCJub3JtYWxpemVkSWRlbnRpZmllciIsIm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllciIsImhhcyIsImRlZmVycmVkIiwic2V0IiwiaXNJbml0aWFsaXplZCIsInNob3VsZEF1dG9Jbml0aWFsaXplIiwiZ2V0T3JJbml0aWFsaXplU2VydmljZSIsImluc3RhbmNlSWRlbnRpZmllciIsImdldEltbWVkaWF0ZSIsIm9wdGlvbnMiLCJvcHRpb25hbCIsImdldENvbXBvbmVudCIsInNldENvbXBvbmVudCIsImlzQ29tcG9uZW50RWFnZXIiLCJpbnN0YW5jZURlZmVycmVkIiwiZW50cmllcyIsImNsZWFySW5zdGFuY2UiLCJkZWxldGUiLCJhc3luYyIsInNlcnZpY2VzIiwiZnJvbSIsInZhbHVlcyIsImFsbCIsIm1hcCIsIklOVEVSTkFMIiwiX2RlbGV0ZSIsImlzQ29tcG9uZW50U2V0IiwiZ2V0T3B0aW9ucyIsImluaXRpYWxpemUiLCJvcHRzIiwib25Jbml0IiwiZXhpc3RpbmdDYWxsYmFja3MiLCJTZXQiLCJleGlzdGluZ0luc3RhbmNlIiwiaW52b2tlT25Jbml0Q2FsbGJhY2tzIiwiY2FsbGJhY2tzIiwiQ29tcG9uZW50Q29udGFpbmVyIiwicHJvdmlkZXJzIiwiYWRkQ29tcG9uZW50IiwicHJvdmlkZXIiLCJnZXRQcm92aWRlciIsImFkZE9yT3ZlcndyaXRlQ29tcG9uZW50IiwiZ2V0UHJvdmlkZXJzIiwiTG9nTGV2ZWwiLCJsZXZlbFN0cmluZ1RvRW51bSIsIkRFQlVHIiwiVkVSQk9TRSIsIklORk8iLCJXQVJOIiwiRVJST1IiLCJTSUxFTlQiLCJkZWZhdWx0TG9nTGV2ZWwiLCJDb25zb2xlTWV0aG9kIiwiZGVmYXVsdExvZ0hhbmRsZXIiLCJsb2dUeXBlIiwiYXJncyIsImxvZ0xldmVsIiwidG9JU09TdHJpbmciLCJtZXRob2QiLCJMb2dnZXIiLCJfbG9nTGV2ZWwiLCJfbG9nSGFuZGxlciIsIl91c2VyTG9nSGFuZGxlciIsInZhbCIsIlR5cGVFcnJvciIsInNldExvZ0xldmVsIiwibG9nSGFuZGxlciIsInVzZXJMb2dIYW5kbGVyIiwiZGVidWciLCJpZGJQcm94eWFibGVUeXBlcyIsImN1cnNvckFkdmFuY2VNZXRob2RzIiwiY3Vyc29yUmVxdWVzdE1hcCIsIldlYWtNYXAiLCJ0cmFuc2FjdGlvbkRvbmVNYXAiLCJ0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAiLCJ0cmFuc2Zvcm1DYWNoZSIsInJldmVyc2VUcmFuc2Zvcm1DYWNoZSIsImlkYlByb3h5VHJhcHMiLCJ0YXJnZXQiLCJwcm9wIiwicmVjZWl2ZXIiLCJJREJUcmFuc2FjdGlvbiIsIm9iamVjdFN0b3JlTmFtZXMiLCJvYmplY3RTdG9yZSIsInRyYW5zZm9ybUNhY2hhYmxlVmFsdWUiLCJmdW5jIiwiSURCRGF0YWJhc2UiLCJ0cmFuc2FjdGlvbiIsIklEQkN1cnNvciIsImFkdmFuY2UiLCJjb250aW51ZSIsImNvbnRpbnVlUHJpbWFyeUtleSIsImFwcGx5IiwidW53cmFwIiwic3RvcmVOYW1lcyIsInR4IiwiY2FsbCIsInNvcnQiLCJkb25lIiwidW5saXN0ZW4iLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY29tcGxldGUiLCJET01FeGNlcHRpb24iLCJjYWNoZURvbmVQcm9taXNlRm9yVHJhbnNhY3Rpb24iLCJvYmplY3QiLCJJREJPYmplY3RTdG9yZSIsIklEQkluZGV4Iiwic29tZSIsIlByb3h5IiwiSURCUmVxdWVzdCIsInN1Y2Nlc3MiLCJwcm9taXNpZnlSZXF1ZXN0IiwibmV3VmFsdWUiLCJvcGVuREIiLCJ2ZXJzaW9uIiwiYmxvY2tlZCIsInVwZ3JhZGUiLCJibG9ja2luZyIsInRlcm1pbmF0ZWQiLCJvcGVuUHJvbWlzZSIsImV2ZW50Iiwib2xkVmVyc2lvbiIsIm5ld1ZlcnNpb24iLCJkYiIsInJlYWRNZXRob2RzIiwid3JpdGVNZXRob2RzIiwiY2FjaGVkTWV0aG9kcyIsImdldE1ldGhvZCIsInRhcmdldEZ1bmNOYW1lIiwidXNlSW5kZXgiLCJpc1dyaXRlIiwic3RvcmVOYW1lIiwic3RvcmUiLCJpbmRleCIsInNoaWZ0Iiwib2xkVHJhcHMiLCJQbGF0Zm9ybUxvZ2dlclNlcnZpY2VJbXBsIiwiZ2V0UGxhdGZvcm1JbmZvU3RyaW5nIiwiaXNWZXJzaW9uU2VydmljZVByb3ZpZGVyIiwibGlicmFyeSIsImxvZ1N0cmluZyIsIm5hbWUkbyIsInZlcnNpb24kMSIsImxvZ2dlciIsIlBMQVRGT1JNX0xPR19TVFJJTkciLCJfYXBwcyIsIl9jb21wb25lbnRzIiwiX2FkZENvbXBvbmVudCIsImFwcCIsIl9yZWdpc3RlckNvbXBvbmVudCIsImNvbXBvbmVudE5hbWUiLCJoZWFydGJlYXRDb250cm9sbGVyIiwidHJpZ2dlckhlYXJ0YmVhdCIsIkVSUk9SX0ZBQ1RPUlkiLCJGaXJlYmFzZUFwcEltcGwiLCJjb25maWciLCJfaXNEZWxldGVkIiwiX29wdGlvbnMiLCJhc3NpZ24iLCJfY29uZmlnIiwiX25hbWUiLCJfYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkIiwiYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkIiwiX2NvbnRhaW5lciIsImNoZWNrRGVzdHJveWVkIiwiaXNEZWxldGVkIiwiYXBwTmFtZSIsImluaXRpYWxpemVBcHAiLCJyYXdDb25maWciLCJleGlzdGluZ0FwcCIsIm5ld0FwcCIsInJlZ2lzdGVyVmVyc2lvbiIsImxpYnJhcnlLZXlPck5hbWUiLCJ2YXJpYW50IiwibGlicmFyeU1pc21hdGNoIiwidmVyc2lvbk1pc21hdGNoIiwid2FybmluZyIsIlNUT1JFX05BTUUiLCJkYlByb21pc2UiLCJnZXREYlByb21pc2UiLCJjcmVhdGVPYmplY3RTdG9yZSIsIm9yaWdpbmFsRXJyb3JNZXNzYWdlIiwid3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIiLCJoZWFydGJlYXRPYmplY3QiLCJwdXQiLCJjb21wdXRlS2V5IiwiaWRiR2V0RXJyb3IiLCJhcHBJZCIsIkhlYXJ0YmVhdFNlcnZpY2VJbXBsIiwiX2hlYXJ0YmVhdHNDYWNoZSIsIl9zdG9yYWdlIiwiSGVhcnRiZWF0U3RvcmFnZUltcGwiLCJfaGVhcnRiZWF0c0NhY2hlUHJvbWlzZSIsInJlYWQiLCJhZ2VudCIsImRhdGUiLCJnZXRVVENEYXRlU3RyaW5nIiwibGFzdFNlbnRIZWFydGJlYXREYXRlIiwiaGVhcnRiZWF0cyIsInNpbmdsZURhdGVIZWFydGJlYXQiLCJoYlRpbWVzdGFtcCIsInZhbHVlT2YiLCJvdmVyd3JpdGUiLCJoZWFydGJlYXRzVG9TZW5kIiwidW5zZW50RW50cmllcyIsImhlYXJ0YmVhdHNDYWNoZSIsIm1heFNpemUiLCJoZWFydGJlYXRFbnRyeSIsImZpbmQiLCJoYiIsImRhdGVzIiwiY291bnRCeXRlcyIsInBvcCIsImV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyIiwiaGVhZGVyU3RyaW5nIiwic3RyaW5naWZ5Iiwic3Vic3RyaW5nIiwiX2NhblVzZUluZGV4ZWREQlByb21pc2UiLCJydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrIiwiaWRiSGVhcnRiZWF0T2JqZWN0IiwicmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCIiwiaGVhcnRiZWF0c09iamVjdCIsImV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCIsIlBBQ0tBR0VfVkVSU0lPTiIsImlzU2VydmVyRXJyb3IiLCJnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQiLCJwcm9qZWN0SWQiLCJleHRyYWN0QXV0aFRva2VuSW5mb0Zyb21SZXNwb25zZSIsInRva2VuIiwicmVxdWVzdFN0YXR1cyIsImV4cGlyZXNJbiIsInJlc3BvbnNlRXhwaXJlc0luIiwiTnVtYmVyIiwiY3JlYXRpb25UaW1lIiwiZ2V0RXJyb3JGcm9tUmVzcG9uc2UiLCJyZXF1ZXN0TmFtZSIsImVycm9yRGF0YSIsInNlcnZlckNvZGUiLCJzZXJ2ZXJNZXNzYWdlIiwic2VydmVyU3RhdHVzIiwic3RhdHVzIiwiZ2V0SGVhZGVycyIsImFwaUtleSIsIkhlYWRlcnMiLCJBY2NlcHQiLCJyZXRyeUlmU2VydmVyRXJyb3IiLCJmbiIsInNsZWVwIiwibXMiLCJWQUxJRF9GSURfUEFUVEVSTiIsImdlbmVyYXRlRmlkIiwiZmlkQnl0ZUFycmF5IiwiVWludDhBcnJheSIsImNyeXB0byIsIm1zQ3J5cHRvIiwiZ2V0UmFuZG9tVmFsdWVzIiwiZmlkIiwic3Vic3RyIiwiZW5jb2RlIiwidGVzdCIsImdldEtleSIsImFwcENvbmZpZyIsImZpZENoYW5nZUNhbGxiYWNrcyIsImZpZENoYW5nZWQiLCJjYWxsRmlkQ2hhbmdlQ2FsbGJhY2tzIiwiY2hhbm5lbCIsImJyb2FkY2FzdENoYW5uZWwiLCJCcm9hZGNhc3RDaGFubmVsIiwib25tZXNzYWdlIiwicG9zdE1lc3NhZ2UiLCJzaXplIiwiYnJvYWRjYXN0RmlkQ2hhbmdlIiwiT0JKRUNUX1NUT1JFX05BTUUiLCJvbGRWYWx1ZSIsInVwZGF0ZSIsInVwZGF0ZUZuIiwiZ2V0SW5zdGFsbGF0aW9uRW50cnkiLCJpbnN0YWxsYXRpb25zIiwicmVnaXN0cmF0aW9uUHJvbWlzZSIsImluc3RhbGxhdGlvbkVudHJ5Iiwib2xkRW50cnkiLCJjbGVhclRpbWVkT3V0UmVxdWVzdCIsInJlZ2lzdHJhdGlvblN0YXR1cyIsInVwZGF0ZU9yQ3JlYXRlSW5zdGFsbGF0aW9uRW50cnkiLCJlbnRyeVdpdGhQcm9taXNlIiwibmF2aWdhdG9yIiwib25MaW5lIiwiaW5Qcm9ncmVzc0VudHJ5IiwicmVnaXN0cmF0aW9uVGltZSIsInJlZ2lzdGVyZWRJbnN0YWxsYXRpb25FbnRyeSIsImhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlciIsImVuZHBvaW50IiwiaGVhZGVycyIsImhlYXJ0YmVhdFNlcnZpY2UiLCJoZWFydGJlYXRzSGVhZGVyIiwiZ2V0SGVhcnRiZWF0c0hlYWRlciIsImFwcGVuZCIsImJvZHkiLCJhdXRoVmVyc2lvbiIsInNka1ZlcnNpb24iLCJvayIsInJlc3BvbnNlVmFsdWUiLCJyZWZyZXNoVG9rZW4iLCJhdXRoVG9rZW4iLCJjcmVhdGVJbnN0YWxsYXRpb25SZXF1ZXN0IiwicmVnaXN0ZXJJbnN0YWxsYXRpb24iLCJ3YWl0VW50aWxGaWRSZWdpc3RyYXRpb24iLCJ0cmlnZ2VyUmVnaXN0cmF0aW9uSWZOZWNlc3NhcnkiLCJlbnRyeSIsInVwZGF0ZUluc3RhbGxhdGlvblJlcXVlc3QiLCJnZW5lcmF0ZUF1dGhUb2tlblJlcXVlc3QiLCJnZXRHZW5lcmF0ZUF1dGhUb2tlbkVuZHBvaW50IiwiZ2V0QXV0aG9yaXphdGlvbkhlYWRlciIsImdldEhlYWRlcnNXaXRoQXV0aCIsImluc3RhbGxhdGlvbiIsInJlZnJlc2hBdXRoVG9rZW4iLCJmb3JjZVJlZnJlc2giLCJ0b2tlblByb21pc2UiLCJpc0VudHJ5UmVnaXN0ZXJlZCIsIm9sZEF1dGhUb2tlbiIsImlzQXV0aFRva2VuRXhwaXJlZCIsInVwZGF0ZUF1dGhUb2tlblJlcXVlc3QiLCJ3YWl0VW50aWxBdXRoVG9rZW5SZXF1ZXN0IiwiaW5Qcm9ncmVzc0F1dGhUb2tlbiIsInJlcXVlc3RUaW1lIiwibWFrZUF1dGhUb2tlblJlcXVlc3RJblByb2dyZXNzRW50cnkiLCJ1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkiLCJmZXRjaEF1dGhUb2tlbkZyb21TZXJ2ZXIiLCJnZXRNaXNzaW5nVmFsdWVFcnJvciIsInZhbHVlTmFtZSIsIklOU1RBTExBVElPTlNfTkFNRSIsImNvbmZpZ0tleXMiLCJrZXlOYW1lIiwiZXh0cmFjdEFwcENvbmZpZyIsImdldElkIiwiaW5zdGFsbGF0aW9uc0ltcGwiLCJnZXRUb2tlbiIsImNvbXBsZXRlSW5zdGFsbGF0aW9uUmVnaXN0cmF0aW9uIiwiQU5BTFlUSUNTX1RZUEUiLCJHVEFHX1VSTCIsInByb21pc2VBbGxTZXR0bGVkIiwicHJvbWlzZXMiLCJkZWZhdWx0UmV0cnlEYXRhIiwidGhyb3R0bGVNZXRhZGF0YSIsImdldFRocm90dGxlTWV0YWRhdGEiLCJzZXRUaHJvdHRsZU1ldGFkYXRhIiwibWV0YWRhdGEiLCJkZWxldGVUaHJvdHRsZU1ldGFkYXRhIiwiZmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5IiwicmV0cnlEYXRhIiwidGltZW91dE1pbGxpcyIsIm1lYXN1cmVtZW50SWQiLCJ0aHJvdHRsZUVuZFRpbWVNaWxsaXMiLCJzaWduYWwiLCJBbmFseXRpY3NBYm9ydFNpZ25hbCIsImFib3J0IiwiYXR0ZW1wdEZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeSIsImFwcEZpZWxkcyIsIl9iIiwiYmFja29mZk1pbGxpcyIsIm1heCIsInRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJzZXRBYm9ydGFibGVUaW1lb3V0IiwiYXBwVXJsIiwiZXJyb3JNZXNzYWdlIiwianNvblJlc3BvbnNlIiwiX2lnbm9yZWQiLCJodHRwU3RhdHVzIiwicmVzcG9uc2VNZXNzYWdlIiwiZmV0Y2hEeW5hbWljQ29uZmlnIiwiaXNSZXRyaWFibGVFcnJvciIsImxpc3RlbmVycyIsImxpc3RlbmVyIiwiZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQiLCJkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdCIsIl9pbml0aWFsaXplQW5hbHl0aWNzIiwiZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCIsIm1lYXN1cmVtZW50SWRUb0FwcElkIiwiZ3RhZ0NvcmUiLCJkYXRhTGF5ZXJOYW1lIiwiZHluYW1pY0NvbmZpZ1Byb21pc2UiLCJmaWRQcm9taXNlIiwiZXJyb3JJbmZvIiwidG9TdHJpbmciLCJ2YWxpZGF0ZUluZGV4ZWREQiIsImVudklzVmFsaWQiLCJkeW5hbWljQ29uZmlnIiwic2NyaXB0VGFncyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidGFnIiwiZmluZEd0YWdTY3JpcHRPblBhZ2UiLCJzY3JpcHQiLCJoZWFkIiwiaW5zZXJ0U2NyaXB0VGFnIiwiY29uZmlnUHJvcGVydGllcyIsIkFuYWx5dGljc1NlcnZpY2UiLCJpbml0aWFsaXphdGlvblByb21pc2VzTWFwIiwiZ3RhZ0NvcmVGdW5jdGlvbiIsIndyYXBwZWRHdGFnRnVuY3Rpb24iLCJnbG9iYWxJbml0RG9uZSIsImZhY3RvcnkiLCJtaXNtYXRjaGVkRW52TWVzc2FnZXMiLCJydW50aW1lIiwiY2hyb21lIiwiYnJvd3NlciIsImNvb2tpZUVuYWJsZWQiLCJkZXRhaWxzIiwiZXJyIiwid2Fybk9uQnJvd3NlckNvbnRleHRNaXNtYXRjaCIsImRhdGFMYXllciIsImdldE9yQ3JlYXRlRGF0YUxheWVyIiwid3JhcHBlZEd0YWciLCJndGFnRnVuY3Rpb25OYW1lIiwiX2FyZ3MiLCJhcmd1bWVudHMiLCJjb21tYW5kIiwiaWRPck5hbWVPclBhcmFtcyIsImd0YWdQYXJhbXMiLCJpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yIiwiZ2FTZW5kVG9MaXN0IiwiZHluYW1pY0NvbmZpZ1Jlc3VsdHMiLCJzZW5kVG9JZCIsImZvdW5kQ29uZmlnIiwiaW5pdGlhbGl6YXRpb25Qcm9taXNlIiwiZ3RhZ09uRXZlbnQiLCJjb3JyZXNwb25kaW5nQXBwSWQiLCJndGFnT25Db25maWciLCJ3cmFwR3RhZyIsIndyYXBPckNyZWF0ZUd0YWciLCJsb2dFdmVudCIsImFuYWx5dGljc0luc3RhbmNlIiwiZXZlbnROYW1lIiwiZXZlbnRQYXJhbXMiLCJndGFnRnVuY3Rpb24iLCJnbG9iYWwiLCJsb2dFdmVudCQxIiwiYW5hbHl0aWNzT3B0aW9ucyIsImFuYWx5dGljcyIsInJlYXNvbiIsIkFuYWx5dGljc0V2ZW50cyIsImFzc2Vzc21lbnRUeXBlIiwic3RhdHVzVGV4dCIsImxhdGxvbmciLCJsb2MiLCJscGllY2VzIiwibGF0IiwicGFyc2VGbG9hdCIsInRvRml4ZWQiLCJsb24iLCJjbGF0IiwiY2xvbiIsInNlbmRMb2NhdGlvbiIsIm1zZyIsIm5ld2dhbmEiLCJkYXRhdXJsIiwiZ2FuYSIsIm5ld1V1aWQiLCJuZXdVc2VyU291cmNlIiwidXVpZCIsInVzZXJTb3VyY2UiLCJhcHBWZXJzaW9uIiwiY29udGVudFZlcnNpb24iLCJnZXRMb2NhdGlvbiIsImV2ZW50U3RyaW5nIiwiYXBwVHlwZSIsInVzZXIiLCJsYW5nIiwiZ2V0QXBwTGFuZ3VhZ2VGcm9tRGF0YVVSTCIsImdldEFwcFR5cGVGcm9tRGF0YVVSTCIsImpvaW5MYXRMb25nIiwiY2xVc2VySWQiLCJsYXRMb25nIiwidGhlUSIsInRoZUEiLCJlbGFwc2VkIiwiYW5zIiwiaXNjb3JyZWN0IiwiYnVja2V0IiwicU5hbWUiLCJhTnVtIiwiZHQiLCJxdWVzdGlvbl9udW1iZXIiLCJxTnVtYmVyIiwicVRhcmdldCIsInF1ZXN0aW9uIiwic2VsZWN0ZWRfYW5zd2VyIiwidGIiLCJwYXNzZWQiLCJibiIsImJ1Y2tldElEIiwiYnRyaWVkIiwibnVtVHJpZWQiLCJiY29ycmVjdCIsIm51bUNvcnJlY3QiLCJidWNrZXROdW1iZXIiLCJudW1iZXJUcmllZEluQnVja2V0IiwibnVtYmVyQ29ycmVjdEluQnVja2V0IiwicGFzc2VkQnVja2V0IiwiYnVja2V0cyIsImJhc2FsQnVja2V0IiwiY2VpbGluZ0J1Y2tldCIsImJhc2FsQnVja2V0SUQiLCJnZXRCYXNhbEJ1Y2tldElEIiwiY2VpbGluZ0J1Y2tldElEIiwiZ2V0Q2VpbGluZ0J1Y2tldElEIiwic2NvcmUiLCJjYWxjdWxhdGVTY29yZSIsIm1heFNjb3JlIiwic2VuZERhdGFUb1RoaXJkUGFydHkiLCJ1cmxQYXJhbXMiLCJ0YXJnZXRQYXJ0eVVSTCIsInhociIsIlhNTEh0dHBSZXF1ZXN0IiwicGF5bG9hZCIsInBheWxvYWRTdHJpbmciLCJzZXRSZXF1ZXN0SGVhZGVyIiwib25sb2FkIiwicmVzcG9uc2VUZXh0Iiwic2VuZCIsInRlc3RlZCIsIkJhc2VRdWl6IiwiZGV2TW9kZUF2YWlsYWJsZSIsImlzSW5EZXZNb2RlIiwiaXNDb3JyZWN0TGFiZWxTaG93biIsImRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXJJZCIsImRldk1vZGVUb2dnbGVCdXR0b25JZCIsImRldk1vZGVNb2RhbElkIiwiZGV2TW9kZUJ1Y2tldEdlblNlbGVjdElkIiwiZGV2TW9kZUNvcnJlY3RMYWJlbFNob3duQ2hlY2tib3hJZCIsInRvZ2dsZURldk1vZGVNb2RhbCIsImRldk1vZGVTZXR0aW5nc01vZGFsIiwiaHJlZiIsImRldk1vZGVUb2dnbGVCdXR0b25Db250YWluZXIiLCJkZXZNb2RlQnVja2V0R2VuU2VsZWN0Iiwib25jaGFuZ2UiLCJoYW5kbGVCdWNrZXRHZW5Nb2RlQ2hhbmdlIiwiZGV2TW9kZVRvZ2dsZUJ1dHRvbiIsIm9uY2xpY2siLCJkZXZNb2RlQ29ycmVjdExhYmVsU2hvd25DaGVja2JveCIsImNoZWNrZWQiLCJoYW5kbGVDb3JyZWN0TGFiZWxTaG93bkNoYW5nZSIsImhpZGVEZXZNb2RlQnV0dG9uIiwib25FbmQiLCJTaG93RW5kIiwidW5pdHlCcmlkZ2UiLCJTZW5kQ2xvc2UiLCJTdXJ2ZXkiLCJzdGFydFN1cnZleSIsIlJlYWR5Rm9yTmV4dCIsImdldE5leHRRdWVzdGlvbiIsIm9uUXVlc3Rpb25FbmQiLCJTZXRGZWVkYmFja1Zpc2liaWxlIiwiY3VycmVudFF1ZXN0aW9uSW5kZXgiLCJIYXNRdWVzdGlvbnNMZWZ0IiwiVHJ5QW5zd2VyIiwiYW5zd2VyIiwic2VuZEFuc3dlcmVkIiwiQWRkU3RhciIsImJ1aWxkUXVlc3Rpb25MaXN0IiwiZmV0Y2hTdXJ2ZXlRdWVzdGlvbnMiLCJTZXRCdXR0b25QcmVzc0FjdGlvbiIsIlNldFN0YXJ0QWN0aW9uIiwiUnVuIiwiUHJlcGFyZUF1ZGlvQW5kSW1hZ2VzRm9yU3VydmV5IiwiR2V0RGF0YVVSTCIsIlNlbmRMb2FkZWQiLCJUcmVlTm9kZSIsInJpZ2h0Iiwic29ydGVkQXJyYXlUb0lEc0JTVCIsInN0YXJ0IiwiZW5kIiwidXNlZEluZGljZXMiLCJtaWQiLCJub2RlIiwic2VhcmNoU3RhZ2UiLCJCdWNrZXRHZW5Nb2RlIiwiQXNzZXNzbWVudCIsImJ1Y2tldEdlbk1vZGUiLCJSYW5kb21CU1QiLCJNQVhfU1RBUlNfQ09VTlRfSU5fTElORUFSX01PREUiLCJzdGFydEFzc2Vzc21lbnQiLCJidWlsZEJ1Y2tldHMiLCJyZXMiLCJmZXRjaEFzc2Vzc21lbnRCdWNrZXRzIiwibnVtQnVja2V0cyIsImJ1Y2tldEFycmF5Iiwicm9vdE9mSURzIiwiYnVja2V0c1Jvb3QiLCJjb252ZXJ0VG9CdWNrZXRCU1QiLCJjdXJyZW50Tm9kZSIsInRyeU1vdmVCdWNrZXQiLCJMaW5lYXJBcnJheUJhc2VkIiwiY3VycmVudExpbmVhckJ1Y2tldEluZGV4IiwiY3VycmVudExpbmVhclRhcmdldEluZGV4IiwiYnVja2V0SWQiLCJpbml0QnVja2V0IiwiY3VycmVudEJ1Y2tldCIsInVzZWRJdGVtcyIsIm51bUNvbnNlY3V0aXZlV3JvbmciLCJjdXJyZW50UXVlc3Rpb24iLCJxdWVzdGlvbkVuZFRpbWVvdXQiLCJlbmRPcGVyYXRpb25zIiwiQ2hhbmdlU3RhckltYWdlQWZ0ZXJBbmltYXRpb24iLCJ0YXJnZXRJdGVtIiwiZm9pbDEiLCJmb2lsMiIsImZvaWwzIiwiYW5zd2VyT3B0aW9ucyIsInF1ZXN0aW9uTnVtYmVyIiwiaXRlbVRleHQiLCJ0cnlNb3ZlQnVja2V0UmFuZG9tQlNUIiwidHJ5TW92ZUJ1Y2tldExpbmVhckFycmF5QmFzZWQiLCJzZW5kQnVja2V0IiwiUHJlbG9hZEJ1Y2tldCIsImhhc1F1ZXN0aW9uc0xlZnQiLCJQcm9ncmVzc0NoZXN0IiwiYXBwbGluayIsInNlbmRGaW5pc2hlZCIsIlVuaXR5QnJpZGdlIiwiVW5pdHkiLCJ1bml0eVJlZmVyZW5jZSIsIlNlbmRNZXNzYWdlIiwibiIsInQiLCJyIiwiTWVzc2FnZUNoYW5uZWwiLCJwb3J0MSIsInBvcnQyIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJuZXh0IiwiYmluZCIsIm8iLCJVUkwiLCJmIiwicyIsInYiLCJubiIsInRuIiwicm4iLCJlbiIsIm9uIiwidW4iLCJhbiIsImNuIiwiaW5zdGFsbGluZyIsInNjcmlwdFVSTCIsInNuIiwicGVyZm9ybWFuY2UiLCJ2biIsImhuIiwibG4iLCJzdGF0ZSIsInN3IiwiaXNFeHRlcm5hbCIsIm9yaWdpbmFsRXZlbnQiLCJtbiIsImlzVXBkYXRlIiwiZGlzcGF0Y2hFdmVudCIsInduIiwid2FpdGluZyIsImRuIiwic2VydmljZVdvcmtlciIsImNvbnRyb2xsZXIiLCJnbiIsInBvcnRzIiwic291cmNlIiwiZ2V0U1ciLCJfX3Byb3RvX18iLCJsIiwidyIsInJlZ2lzdGVyIiwiaW1tZWRpYXRlIiwicmVhZHlTdGF0ZSIsIkJvb2xlYW4iLCJ5biIsInBuIiwib25jZSIsIndhc1dhaXRpbmdCZWZvcmVSZWdpc3RlciIsIm1lc3NhZ2VTVyIsIm1lc3NhZ2VTa2lwV2FpdGluZyIsImVudW1lcmFibGUiLCJjb25maWd1cmFibGUiLCJ3cml0YWJsZSIsImRlZmluZVByb3BlcnR5IiwiUG4iLCJTbiIsImxvYWRpbmdTY3JlZW4iLCJoYW5kbGVTZXJ2aWNlV29ya2VyTWVzc2FnZSIsInByb2dyZXNzVmFsdWUiLCJwcm9ncmVzc0JhciIsIndpZHRoIiwiU2V0Q29udGVudExvYWRlZCIsInNldEl0ZW0iLCJib29rTmFtZSIsIkFuZHJvaWQiLCJpc0NvbnRlbnRDYWNoZWQiLCJjYWNoZWRTdGF0dXMiLCJyZWFkTGFuZ3VhZ2VEYXRhRnJvbUNhY2hlQW5kTm90aWZ5QW5kcm9pZEFwcCIsImhhbmRsZUxvYWRpbmdNZXNzYWdlIiwicHJvZ3Jlc3MiLCJ0ZXh0IiwiY29uZmlybSIsInJlbG9hZCIsImhhbmRsZVVwZGF0ZUZvdW5kTWVzc2FnZSIsImNhY2hlTW9kZWwiLCJjb250ZW50RmlsZVBhdGgiLCJhdWRpb1Zpc3VhbFJlc291cmNlcyIsInNldEFwcE5hbWUiLCJzZXRDb250ZW50RmlsZVBhdGgiLCJzZXRBdWRpb1Zpc3VhbFJlc291cmNlcyIsImFkZEl0ZW1Ub0F1ZGlvVmlzdWFsUmVzb3VyY2VzIiwiZmFuYWx5dGljcyIsImFuYWx5dGljc1Byb3ZpZGVyIiwiaW5pdGlhbGl6ZUFuYWx5dGljcyIsImdldEFuYWx5dGljcyIsImF1dGhEb21haW4iLCJkYXRhYmFzZVVSTCIsInN0b3JhZ2VCdWNrZXQiLCJtZXNzYWdpbmdTZW5kZXJJZCIsInNwaW5VcCIsImZldGNoQXBwRGF0YSIsIlNldEZlZWRiYWNrVGV4dCIsImdhbWUiLCJhdWRpb0l0ZW1VUkwiLCJudXVpZCIsInNldFV1aWQiLCJnZXRVc2VyU291cmNlIiwibGlua0FuYWx5dGljcyIsInNldEFzc2Vzc21lbnRUeXBlIiwic2VuZEluaXQiLCJyZWdpc3RlclNlcnZpY2VXb3JrZXIiLCJyZWdpc3RyYXRpb24iLCJoYW5kbGVTZXJ2aWNlV29ya2VyUmVnaXN0YXRpb24iLCJyZWFkeSIsImFwcERhdGEiXSwic291cmNlUm9vdCI6IiJ9
