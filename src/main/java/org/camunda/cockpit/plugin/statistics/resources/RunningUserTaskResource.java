package org.camunda.cockpit.plugin.statistics.resources;

import java.util.List;

import javax.ws.rs.GET;

import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginResource;
import org.camunda.cockpit.plugin.statistics.db.RunningUserTaskDto;

/**
 * This class gets the count of all running user tasks ordered by proc def key
 *
 * @author EKL
 */

public class RunningUserTaskResource extends AbstractCockpitPluginResource {
	
	public RunningUserTaskResource(String engineName) {
		super(engineName);
    }
	
    /**
     * This method read the information of the defined mapping.xml file from
     * myBatis. {@link com.novatec.camunda.webapp.statistics.queries.selectRunningUserTasksCountByProcDefKey.xml}
     *
     * @return
     */
    @GET
    public List<RunningUserTaskDto> getRunningUserTaskCounts() {
    	
    	return getQueryService().executeQuery("cockpit.statistics.selectRunningUserTasksCountByProcDefKey",
    	    new QueryParameters<RunningUserTaskDto>());
    	
    }

}
