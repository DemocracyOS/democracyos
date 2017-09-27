import * as topicFormView from 'lib/admin/admin-topics-form/view'
import * as topicFormViewOverride from 'ext/lib/admin/admin-topics-form/view'

topicFormView.default = topicFormViewOverride.default

import * as topicListView from 'lib/admin/admin-topics/view'
import * as topicListViewOverride from 'ext/lib/admin/admin-topics/view'

topicListView.default = topicListViewOverride.default