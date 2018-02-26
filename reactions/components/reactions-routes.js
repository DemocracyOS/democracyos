import React from 'react'
import { Route } from 'react-router-dom'
import { Delete } from 'admin-on-rest'
import { ReactionRuleList, ReactionRuleCreate, ReactionRuleEdit } from './reaction-rule'
import { ReactionInstanceList, ReactionInstanceCreate, ReactionInstanceEdit, ReactionInstanceShow } from './reaction-instance'

export default [
  <Route exact path='/admin/reaction-rule' render={(routeProps) => <ReactionRuleList hasCreate resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/create' render={(routeProps) => <ReactionRuleCreate resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id' render={(routeProps) => <ReactionRuleEdit resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id/delete' render={(routeProps) => <Delete resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-instance' render={(routeProps) => <ReactionInstanceList hasCreate resource='reaction-instance' {...routeProps} />} />,
  <Route exact path='/admin/reaction-instance/create' render={(routeProps) => <ReactionInstanceCreate resource='reaction-instance' {...routeProps} />} />,
  <Route exact path='/admin/reaction-instance/:id' render={(routeProps) => <ReactionInstanceEdit resource='reaction-instance' {...routeProps} />} />,
  <Route exact path='/admin/reaction-instance/:id/show' render={(routeProps) => <ReactionInstanceShow resource='reaction-instance' {...routeProps} />} />,
  <Route exact path='/admin/reaction-instance/:id/delete' render={(routeProps) => <Delete resource='reaction-instance' {...routeProps} />} />
]
