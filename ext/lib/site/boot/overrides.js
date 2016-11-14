import * as Layout from 'lib/site/layout/component'
import * as LayoutOverride from 'ext/lib/site/layout/component'

import * as Header from 'lib/site/header/component'
import * as HeaderOverride from 'ext/lib/site/header/component'

import * as HomeMultiforum from 'lib/site/home-multiforum/component'
import * as HomeMultiforumOverride from 'ext/lib/site/home-multiforum/component'

import * as HomeForum from 'lib/site/home-forum/component'
import * as HomeForumOverride from 'ext/lib/site/home-forum/component'

import * as TopicLayoutSidebar from 'lib/site/topic-layout/sidebar/component'
import * as TopicLayoutSidebarOverride from 'ext/lib/site/topic-layout/sidebar/component'

Object.assign(Layout, LayoutOverride)
Object.assign(Header, HeaderOverride)
Object.assign(HomeMultiforum, HomeMultiforumOverride)
Object.assign(HomeForum, HomeForumOverride)
Object.assign(TopicLayoutSidebar, TopicLayoutSidebarOverride)
