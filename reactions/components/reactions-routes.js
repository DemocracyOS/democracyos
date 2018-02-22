import React from 'react'
import { Route } from 'react-router-dom'
import { Delete } from 'admin-on-rest'
import { ReactionRuleList, ReactionRuleCreate, ReactionRuleEdit } from './reaction-rule'

export default [
  <Route exact path='/admin/reaction-rule' render={(routeProps) => <ReactionRuleList hasCreate={true} resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/create' render={(routeProps) => <ReactionRuleCreate resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id' render={(routeProps) => <ReactionRuleEdit resource='reaction-rule' {...routeProps} />} />,
  <Route exact path='/admin/reaction-rule/:id/delete' render={(routeProps) => <Delete resource='reaction-rule' {...routeProps} />} />
]
