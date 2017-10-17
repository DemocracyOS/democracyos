import 'ext/lib/boot/overrides'

import * as HomeMultiforum from 'lib/site/home-multiforum/component'
import * as HomeMultiforumOverride from 'ext/lib/site/home-multiforum/component'

import * as HomeForum from 'lib/site/home-forum/component'
import * as HomeForumOverride from 'ext/lib/site/home-forum/component'

import * as TopicLayoutSidebar from 'lib/site/topic-layout/sidebar/component'
import * as TopicLayoutSidebarOverride from 'ext/lib/site/topic-layout/sidebar/component'

import * as TopicArticle from 'lib/site/topic-layout/topic-article/component'
import * as TopicArticleOverride from 'ext/lib/site/topic-layout/topic-article/component'

import * as SignUp from 'lib/site/sign-up/component'
import * as SignUpOverride from 'ext/lib/site/sign-up/component'

Object.assign(HomeMultiforum, HomeMultiforumOverride)
Object.assign(HomeForum, HomeForumOverride)
Object.assign(TopicLayoutSidebar, TopicLayoutSidebarOverride)
Object.assign(TopicArticle, TopicArticleOverride)
Object.assign(SignUp, SignUpOverride)
