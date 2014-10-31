package org.camunda.cockpit.plugin.statistics.dto.process;

import java.util.Date;

public class ProcessDurationDto {

	private String processDefinitionKey;
	private Date startingTime;
	private long duration;
	
	
	
	public String getProcessDefinitionKey() {
		return processDefinitionKey;
	}
	public void setProcessDefinitionKey(String processDefinitionKey) {
		this.processDefinitionKey = processDefinitionKey;
	}
	public Date getStartingTime() {
		return startingTime;
	}
	public void setStartingTime(Date startingTime) {
		this.startingTime = startingTime;
	}
	public long getDuration() {
		return duration;
	}
	public void setDuration(long duration) {
		this.duration = duration;
	}
	
	

	

}

